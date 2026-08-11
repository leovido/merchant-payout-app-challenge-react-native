## Tech stack
- React Native with Expo modules, new architecture.
- Use PNPM as a package manager
- Programming languages: TypeScript, Swift, Kotlin
- iOS: no SPM, only Cocoapods
- Android: Gradle

## Verify your work
Before verifying your work, start with a fresh Metro instance. Once you have started a new instance for each feature you're working on, there's no need to reset and restart Metro.
1. Check port 8081, and kill the process. This allows you to start clean.
2. Run `verify.sh` script after each commit and change that you make.
3. If Lefthook is set up, wait for the pre-commit script to complete.
4. Fix any errors that may arise, and commit.
5. Every commit must be passing green: lint, test, typecheck. 

## React Native software best practices
- Prefer Functional Programming paradigm over Object Oriented Programming.
- Prefer modules over monoliths. Find a balance to deliver solutions that are maintainable and scalable.
- Focus on high cohesion solutions. When interacting with existing code, determine if your changes will decrease cohesion. In this case, refactor if it makes software more cohesive.
- Focus on low coupling. 
- Prevent nested if statements and refactor when needed.
- Use React Compound components pattern for UI.
- Only use `useEffect` when required. Prefer refactoring or creating custom hooks.
- Everything must have its own passing unit testing file for each function. Cover happy and unhappy paths. Ignore edge cases unless you're told to write them.