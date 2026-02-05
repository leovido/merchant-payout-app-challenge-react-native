---
name: Lefthook and GitHub Actions
overview: Implement Lefthook for pre-commit/pre-push hooks and GitHub Actions for PR checks, aligned with the loaded DevOps and Development skills. Migrate the project to pnpm; omit SonarQube for now; include optional Codecov upload.
todos: []
isProject: false
---

# Lefthook and GitHub Actions Implementation

## Skills loaded

- **DevOps** ([Skillport devops](file:///.skillport/skills/devops)): PR checks (security, tests, lint), pnpm, `actions/checkout@v4`, `pnpm/action-setup@v2`, `actions/setup-node@v4`, optional Codecov.
- **Development** ([Skillport development](file:///.skillport/skills/development)): Lefthook for Git hooks, pre-commit (lint + format), pre-push (full test suite + typecheck), Biome, TypeScript.

---

## 1. Migrate to pnpm

- **Add pnpm**: Ensure pnpm is used (version from your rules: >= 10). In CI we will use `pnpm/action-setup@v2` with `version: 10` (or `version: '10'`).
- **Lockfile**: Run `pnpm import` to generate `pnpm-lock.yaml` from existing `package-lock.json`, then remove `package-lock.json` and add `pnpm-lock.yaml` to the repo.
- **Scripts**: All commands in Lefthook and GitHub Actions will use `pnpm` (e.g. `pnpm run lint`, `pnpm run test`, `pnpm install --frozen-lockfile`).
- **Optional**: Add `packageManager` in [package.json](package.json) for corepack (e.g. `"packageManager": "pnpm@10.0.0"`) if you want to enforce pnpm version.

---

## 2. Scripts required for hooks and CI

Add to [package.json](package.json) (and keep existing `lint`, `lint:fix`, `test`, `test:watch`):


| Script         | Command                                   | Purpose                                                          |
| -------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `typecheck`    | `tsc --noEmit`                            | Pre-push and CI                                                  |
| `test:ci`      | `jest --ci` (and optionally `--coverage`) | CI and coverage                                                  |
| `format:check` | `biome check .`                           | Same as lint for CI naming; can alias to `lint` or keep separate |


- Use **Node** from [.nvmrc](.nvmrc) (currently `24`) in GitHub Actions for consistency; your rules mention 22.x LTS, so you can change `.nvmrc` to `22` if you prefer.
- Ensure the current test suite passes: you have [mocks/server.test.ts](mocks/server.test.ts) (setup only; Jest will run and exit 0). No change required for “passing tests” unless you want a minimal smoke test.

---

## 3. Lefthook setup

- **Install**: Add Lefthook as a dev dependency and install Git hooks.
  - `pnpm add -D @evilmartians/lefthook`
  - `pnpm exec lefthook install`
- **Config**: Add [lefthook.yml](lefthook.yml) at repo root.

**Pre-commit** (Development skill: lint + format):

- Run `pnpm run lint` (Biome already does lint + format check in one pass). Optionally run `pnpm run format:check` if you add that script.
- Commands: `pnpm run lint` (and optionally `pnpm run lint:fix` to auto-fix and stage, or keep check-only so developer fixes manually).

**Pre-push** (Development skill: full test suite + typecheck):

- Run `pnpm run typecheck`
- Run `pnpm run test`

Example structure:

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      run: pnpm run lint

pre-push:
  parallel: false  # or true if you prefer
  commands:
    typecheck:
      run: pnpm run typecheck
    test:
      run: pnpm run test
```

- **Passing tests**: With current one file and no `test()` in it, Jest still passes. When you add tests later, pre-push will run them automatically.

---

## 4. GitHub Actions (PR checks)

- **Location**: Create [.github/workflows/pr-checks.yml](.github/workflows/pr-checks.yml).
- **Trigger**: `pull_request` to `main` (and optionally `develop` if you use it).
- **Actions**: Use `actions/checkout@v4`, `pnpm/action-setup@v2` with version `10`, `actions/setup-node@v4` with `node-version` from `.nvmrc` (e.g. `node-version-file: '.nvmrc'`) and `cache: 'pnpm'`.

**Jobs** (no SonarQube per your choice):

1. **security**
  - `pnpm install --frozen-lockfile`  
  - `pnpm audit --audit-level=moderate` (or `high` if you prefer).
2. **test**
  - `pnpm install --frozen-lockfile`  
  - `pnpm run test:ci` (Jest with `--ci` and coverage).  
  - Optional Codecov: use `codecov/codecov-action@v4` (or v3); upload only when `CODECOV_TOKEN` is set (optional secret).
3. **lint**
  - `pnpm install --frozen-lockfile`  
  - `pnpm run lint` (and `pnpm run format:check` if you add it; otherwise lint alone is enough).

Jobs can run in parallel. No SonarQube step.

---

## 5. Files to add or change


| Action         | File                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Add            | `lefthook.yml`                                                                                                             |
| Add            | `.github/workflows/pr-checks.yml`                                                                                          |
| Edit           | `package.json` – add scripts `typecheck`, `test:ci`, optionally `format:check`; add devDependency `@evilmartians/lefthook` |
| Edit           | Remove `package-lock.json` after generating `pnpm-lock.yaml`                                                               |
| Add (optional) | `packageManager` in package.json for corepack                                                                              |


---

## 6. Post-setup

- Run `pnpm install` and `pnpm exec lefthook install` (or add a `postinstall` script that runs `lefthook install` so hooks install for every clone).
- Verify: make a small commit and push; pre-commit should run lint, pre-push should run typecheck and test; PR should run security, test, and lint in GitHub Actions.
- When you add tests later, no Lefthook or workflow changes are required; pre-push and CI will pick them up.

---

## Summary

- **Lefthook**: pre-commit = lint; pre-push = typecheck + test (passing with current repo).
- **GitHub Actions**: security (pnpm audit), test (test:ci + optional Codecov), lint; pnpm and Node from .nvmrc; no SonarQube.
- **Repo**: Migrate to pnpm and add the scripts above so both hooks and CI use the same commands.

