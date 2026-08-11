#!/usr/bin/env bash
#
# verify.sh — verifies the app is healthy.
#
# Runs, in order:
#   1. Lint          (pnpm run lint)
#   2. Typecheck     (pnpm run typecheck)
#   3. Tests         (pnpm run test)
#   4. iOS app       (pnpm run ios)      — builds, boots simulator, checks for errors
#   5. Android app   (pnpm run android)  — builds, boots emulator/device, checks for errors
#
# The app steps launch the app, wait for it to build + boot, then scan the
# runtime logs for crashes / red-box error screens. A clean run exits 0.
#
# Usage:
#   ./verify.sh                # run everything
#   ./verify.sh --skip-ios     # skip the iOS step
#   ./verify.sh --skip-android # skip the Android step
#   ./verify.sh --lint-only    # only lint + typecheck + test
#
# Env overrides:
#   BOOT_TIMEOUT   seconds to wait for a native build+boot (default 900)
#   OBSERVE_TIME   seconds to watch runtime logs for errors (default 25)

set -uo pipefail

# ----------------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------------
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

BOOT_TIMEOUT="${BOOT_TIMEOUT:-900}"
OBSERVE_TIME="${OBSERVE_TIME:-25}"
LOG_DIR="$ROOT_DIR/.verify-logs"
mkdir -p "$LOG_DIR"

RUN_IOS=1
RUN_ANDROID=1

for arg in "$@"; do
  case "$arg" in
    --skip-ios)     RUN_IOS=0 ;;
    --skip-android) RUN_ANDROID=0 ;;
    --lint-only)    RUN_IOS=0; RUN_ANDROID=0 ;;
    -h|--help)      sed -n '2,23p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; exit 2 ;;
  esac
done

# ----------------------------------------------------------------------------
# Pretty output
# ----------------------------------------------------------------------------
if [ -t 1 ]; then
  C_RESET="\033[0m"; C_RED="\033[31m"; C_GREEN="\033[32m"
  C_YELLOW="\033[33m"; C_BLUE="\033[34m"; C_BOLD="\033[1m"
else
  C_RESET=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_BOLD=""
fi

step()  { printf "\n${C_BOLD}${C_BLUE}==> %s${C_RESET}\n" "$1"; }
info()  { printf "    %s\n" "$1"; }
ok()    { printf "${C_GREEN}✓ %s${C_RESET}\n" "$1"; }
warn()  { printf "${C_YELLOW}! %s${C_RESET}\n" "$1"; }
fail()  { printf "${C_RED}✗ %s${C_RESET}\n" "$1"; }

# Patterns that indicate a broken app (red box / crash / bundling failure).
# Kept deliberately specific to avoid matching benign log noise.
ERROR_PATTERNS='(Unable to resolve module|Failed to construct transformer|SyntaxError:|Error: Unable to load script|Metro has encountered an error|Invariant Violation|RedBox|Unhandled JS Exception|Application .* has not been registered|Could not connect to development server|BUILD FAILED|FAILURE: Build failed|error: Building workspace|The following build commands failed|xcodebuild: error|CommandError:|Cannot determine which native)'

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------

# Scan a log file for known-bad signatures. Returns 0 if clean, 1 if errors.
scan_log_for_errors() {
  local logfile="$1"
  local matches
  matches="$(grep -nE "$ERROR_PATTERNS" "$logfile" 2>/dev/null || true)"
  if [ -n "$matches" ]; then
    fail "Detected error signatures in logs:"
    echo "$matches" | sed 's/^/      /'
    return 1
  fi
  return 0
}

# Wait until the log shows the app has finished building + launched, or timeout.
# $1 = log file, $2 = success regex, $3 = human label
wait_for_boot() {
  local logfile="$1" success_re="$2" label="$3"
  local waited=0
  info "Waiting up to ${BOOT_TIMEOUT}s for ${label} to build & boot..."
  while [ "$waited" -lt "$BOOT_TIMEOUT" ]; do
    # Bail early if the build already failed.
    if grep -qE "$ERROR_PATTERNS" "$logfile" 2>/dev/null; then
      return 2
    fi
    if grep -qE "$success_re" "$logfile" 2>/dev/null; then
      return 0
    fi
    sleep 3
    waited=$((waited + 3))
  done
  return 1
}

# Kill a background process tree quietly.
kill_tree() {
  local pid="$1"
  [ -z "$pid" ] && return 0
  pkill -P "$pid" 2>/dev/null || true
  kill "$pid" 2>/dev/null || true
}

# ----------------------------------------------------------------------------
# 1. Lint
# ----------------------------------------------------------------------------
step "1/5  Lint  (pnpm run lint)"
if pnpm run lint; then
  ok "Lint passed"
else
  fail "Lint failed"
  exit 1
fi

# ----------------------------------------------------------------------------
# 2. Typecheck
# ----------------------------------------------------------------------------
step "2/5  Typecheck  (pnpm run typecheck)"
if pnpm run typecheck; then
  ok "Typecheck passed"
else
  fail "Typecheck failed"
  exit 1
fi

# ----------------------------------------------------------------------------
# 3. Test
# ----------------------------------------------------------------------------
step "3/5  Test  (pnpm run test)"
if CI=1 pnpm run test; then
  ok "Tests passed"
else
  fail "Tests failed"
  exit 1
fi

# ----------------------------------------------------------------------------
# Shared runner for a native platform
# ----------------------------------------------------------------------------
# $1 = label (iOS/Android)  $2 = pnpm script  $3 = boot-success regex
run_platform() {
  local label="$1" script="$2" success_re="$3"
  local logfile="$LOG_DIR/${label,,}.log"
  : > "$logfile"

  info "Launching: pnpm run ${script}"
  info "Logs: ${logfile}"

  # Run detached with its own process group so we can tear it (and Metro) down.
  ( pnpm run "$script" >"$logfile" 2>&1 ) &
  local pid=$!

  wait_for_boot "$logfile" "$success_re" "$label"
  local boot_rc=$?

  case "$boot_rc" in
    0) ok "${label} app built and launched" ;;
    2) fail "${label} build failed"; scan_log_for_errors "$logfile"; kill_tree "$pid"; return 1 ;;
    *) fail "${label} did not boot within ${BOOT_TIMEOUT}s"; kill_tree "$pid"; return 1 ;;
  esac

  # Let the JS bundle load & the first screen render, then look for red-box errors.
  info "Observing runtime for ${OBSERVE_TIME}s to catch error screens..."
  sleep "$OBSERVE_TIME"

  local result=0
  if scan_log_for_errors "$logfile"; then
    ok "${label} running cleanly — no errors or error screen detected"
  else
    fail "${label} showed errors after launch"
    result=1
  fi

  kill_tree "$pid"
  return "$result"
}

OVERALL=0

# ----------------------------------------------------------------------------
# 3. iOS
# ----------------------------------------------------------------------------
if [ "$RUN_IOS" -eq 1 ]; then
  step "4/5  iOS  (pnpm run ios)"
  if ! command -v xcrun >/dev/null 2>&1; then
    warn "xcrun not found — skipping iOS (macOS + Xcode required)"
  else
    # Success when the bundle is served AND the app is opened on the simulator.
    run_platform "iOS" "ios" '(Bundled [0-9]+ms|Opening on|Successfully launched|› Metro waiting|Launching .* on)' \
      || OVERALL=1
  fi
else
  step "4/5  iOS  (skipped)"
fi

# ----------------------------------------------------------------------------
# 4. Android
# ----------------------------------------------------------------------------
if [ "$RUN_ANDROID" -eq 1 ]; then
  step "5/5  Android  (pnpm run android)"
  if ! command -v adb >/dev/null 2>&1; then
    warn "adb not found — skipping Android (Android SDK required)"
  else
    run_platform "Android" "android" '(Bundled [0-9]+ms|Opening on|Starting: Intent|Successfully launched|› Metro waiting|Launching .* on)' \
      || OVERALL=1
  fi
else
  step "5/5  Android  (skipped)"
fi

# ----------------------------------------------------------------------------
# Summary
# ----------------------------------------------------------------------------
step "Summary"
if [ "$OVERALL" -eq 0 ]; then
  ok "All checks passed"
else
  fail "One or more app checks failed — see $LOG_DIR for details"
fi
exit "$OVERALL"
