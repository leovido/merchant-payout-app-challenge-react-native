import type { HydrationEnvelope, HydrationQueue } from '../hydration/index.js';
import type { HydrationOptions } from '../types.js';
/** What caused a hydration attempt. */
export type HydrationTrigger = 'appLaunch' | 'appStateActive' | 'manual';
/**
 * Supplies decrypted, reassembled payloads for a trigger. Implemented by the
 * native bridge in production and by mocks/tests otherwise. Returning `null`
 * means "nothing to hydrate" and is a normal, silent outcome.
 */
export interface HydrationSource {
    resolve(trigger: HydrationTrigger): Promise<HydrationEnvelope | null>;
}
export interface HydrationDispatchDeps<T> {
    source: HydrationSource;
    getBaseState: () => Partial<T>;
    options: HydrationOptions<T>;
    queue: HydrationQueue<T>;
}
/**
 * Build the trigger handler shared by the provider's lifecycle effects.
 *
 * Resolves an envelope from the source, then routes it through the queue so
 * only the newest request is applied. Source-resolution failures are surfaced
 * as a typed failure result (via `onHydrate`/`onError`); a `null` envelope is
 * a no-op. This function is pure with respect to React and unit-testable.
 */
export declare function createHydrationDispatch<T>(deps: HydrationDispatchDeps<T>): (trigger: HydrationTrigger) => Promise<void>;
//# sourceMappingURL=dispatch.d.ts.map