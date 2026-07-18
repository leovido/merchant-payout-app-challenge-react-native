import type { HydrationResult } from '../types.js';
/**
 * Merge a failed hydration's `fallback` partial into `current`, emitting an
 * explicit warning so callers never silently ignore {@link HydrationError}s.
 */
export declare function mergeHydrationFallback<T extends object>(current: T, result: Extract<HydrationResult<T>, {
    ok: false;
}>, onWarn?: (message: string) => void): T;
/**
 * Route a {@link HydrationResult} to success or fallback handlers. Use inside
 * `onHydrate` to keep failure handling explicit and warning-backed.
 */
export declare function resolveHydrationResult<T extends object>(current: T, result: HydrationResult<T>, handlers: {
    onSuccess: (patch: Extract<HydrationResult<T>, {
        ok: true;
    }>) => T;
    onWarn?: (message: string) => void;
}): T;
//# sourceMappingURL=fallback.d.ts.map