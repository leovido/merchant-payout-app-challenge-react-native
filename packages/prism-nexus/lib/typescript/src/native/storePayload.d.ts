import type { HydrationWirePayload } from './wirePayload.js';
/** Persist a signed wire payload in native ephemeral storage. */
export declare function storeHydrationPayload(payload: HydrationWirePayload): Promise<void>;
export interface SealAndStorePayloadInput {
    reqId: string;
    state: unknown;
    ctx: string;
    version?: number;
    ts?: number;
}
/**
 * Encrypt, sign, and store a payload using device-bound native keys.
 * Requires native `testMode` (via {@link configureNativeHydrator}) until a
 * trusted external signer is integrated.
 */
export declare function sealAndStoreHydrationPayload(input: SealAndStorePayloadInput): Promise<HydrationWirePayload>;
//# sourceMappingURL=storePayload.d.ts.map