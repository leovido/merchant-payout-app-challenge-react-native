import type { HydrationOptions } from '../types.js';
import type { HydrationSource } from './dispatch.js';
export interface HydratorControllerConfig<T> extends HydrationOptions<T> {
    /** Bridge/mocked source of hydration payloads. */
    source: HydrationSource;
    /** Current base state to diff against; defaults to an empty object. */
    getBaseState?: () => Partial<T>;
}
export interface HydratorController {
    /** Imperatively trigger a hydration attempt (the `hydrateNow()` API). */
    hydrateNow: () => void;
}
/**
 * Wires hydration triggers to React lifecycle: an initial `appLaunch` attempt,
 * a foreground (`background`/`inactive` -> `active`) subscription with cleanup,
 * and an imperative `hydrateNow`. Config is read through a ref so callback and
 * source changes never resubscribe or recreate the request queue.
 */
export declare function useHydrationController<T>(config: HydratorControllerConfig<T>): HydratorController;
//# sourceMappingURL=useHydrationController.d.ts.map