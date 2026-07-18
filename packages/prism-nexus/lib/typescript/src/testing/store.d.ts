import type { HydrationError } from '../errors.js';
import type { HydrationEnvelope } from '../hydration/index.js';
export interface StoredEntry {
    reqId: string;
    envelope: HydrationEnvelope;
    createdAt: number;
    expired: boolean;
}
export interface HydrationStateSnapshot {
    /** Request ids currently held, in insertion order. */
    stored: string[];
    /** Count of entries still live (not expired). */
    cached: number;
    /** Errors recorded during the session. */
    errors: HydrationError[];
}
/**
 * In-memory stand-in for the native secure store, used under `testMode`. It
 * lets tests seed payloads, inspect what is held, and simulate TTL expiry
 * without touching the native bridge, Keychain, or Keystore.
 */
export declare class TestHydrationStore {
    private readonly entries;
    private readonly errors;
    put(envelope: HydrationEnvelope, createdAt?: number): void;
    recordError(error: HydrationError): void;
    /** Return and consume the oldest live entry, or `null` if none remain. */
    takeNextLive(): HydrationEnvelope | null;
    /** Mark every held entry expired, mirroring a TTL sweep. */
    expireAll(): void;
    inspect(): HydrationStateSnapshot;
    reset(): void;
}
//# sourceMappingURL=store.d.ts.map