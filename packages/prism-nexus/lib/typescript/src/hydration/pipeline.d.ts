import type { HydrationClaims } from '../routing/index.js';
import type { HydrationOptions, HydrationResult } from '../types.js';
/**
 * JS-layer input to the pipeline: the decrypted, reassembled payload handed
 * up by the native bridge. The native layer owns decryption, signature, TTL,
 * and chunk reassembly; the pipeline owns validation, routing, and diffing.
 */
export interface HydrationEnvelope {
    /** Crypto-random request id used for debounce/queue de-duplication. */
    reqId: string;
    /** Unencrypted header claims used for version + context routing. */
    claims: HydrationClaims;
    /** Decoded state payload to validate against the schema. */
    state: unknown;
}
/**
 * Pure orchestration for a single hydration attempt.
 *
 * Enforces version bounds, routes the context, validates the payload, then
 * computes the {@link import('../types').DeepPatch} from `base` to the
 * validated state. Never applies the patch — the client owns application
 * timing. On failure, notifies `onError` and returns a typed failure result
 * carrying `base` as the fallback.
 */
export declare function runHydration<T>(envelope: HydrationEnvelope, base: Partial<T>, options: HydrationOptions<T>): HydrationResult<T>;
export interface ScheduledRequest<T> {
    reqId: string;
    run: () => Promise<HydrationResult<T>>;
}
/**
 * Serialises overlapping hydration triggers so only the newest submission is
 * applied. Call {@link beginAttempt} when a trigger starts (before any async
 * work) so late native resolves cannot supersede a newer attempt. Requests are
 * processed one at a time; superseded work is skipped before `run()` when
 * possible, and stale completions are reported via `onWarn` without reaching
 * `onResult`.
 */
export declare class HydrationQueue<T> {
    private readonly onResult;
    private readonly onWarn?;
    private generation;
    private tail;
    constructor(onResult: (result: HydrationResult<T>) => void, onWarn?: ((msg: string) => void) | undefined);
    /** Reserve the next attempt generation before awaiting the hydration source. */
    beginAttempt(): number;
    isCurrentAttempt(generation: number): boolean;
    submit(request: ScheduledRequest<T>, generation: number): Promise<void>;
    private warnStale;
    private processRequest;
}
//# sourceMappingURL=pipeline.d.ts.map