"use strict";

/**
 * Merge a failed hydration's `fallback` partial into `current`, emitting an
 * explicit warning so callers never silently ignore {@link HydrationError}s.
 */
export function mergeHydrationFallback(current, result, onWarn) {
  onWarn?.(`[Hydrator] Applying fallback after ${result.error.code}: ${result.error.message}`);
  return {
    ...current,
    ...result.fallback
  };
}

/**
 * Route a {@link HydrationResult} to success or fallback handlers. Use inside
 * `onHydrate` to keep failure handling explicit and warning-backed.
 */
export function resolveHydrationResult(current, result, handlers) {
  if (result.ok) {
    return handlers.onSuccess(result);
  }
  return mergeHydrationFallback(current, result, handlers.onWarn);
}
//# sourceMappingURL=fallback.js.map