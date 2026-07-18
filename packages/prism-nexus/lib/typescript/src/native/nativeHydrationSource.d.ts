import type { HydrationSource } from '../provider/index.js';
export interface NativeHydrationSourceOptions {
    /**
     * When `true`, throws `NATIVE_MODULE_UNAVAILABLE` if the Expo module is not
     * linked. Defaults to `true` for production hydration paths.
     */
    requireNative?: boolean;
}
/**
 * Production {@link HydrationSource} backed by the Expo native bridge.
 *
 * The native layer owns secure storage, decryption, signature verification,
 * TTL enforcement, and chunk reassembly. This adapter only maps the native
 * envelope into the JS {@link HydrationEnvelope} shape expected by
 * `runHydration`.
 */
export declare function createNativeHydrationSource(options?: NativeHydrationSourceOptions): HydrationSource;
/**
 * Extract a request id from a deep link, preferring the native implementation
 * when available and falling back to the pure-JS parser.
 */
export declare function extractHydrationReqId(url: string): string | null;
/** Invoke the native TTL purge sweep. Returns the number of entries removed. */
export declare function purgeExpiredHydrationEntries(): Promise<number>;
/** Inspect native ephemeral storage (primarily for `testMode` / diagnostics). */
export declare function inspectNativeHydrationStorage(): Promise<{
    stored: string[];
    cached: number;
}>;
//# sourceMappingURL=nativeHydrationSource.d.ts.map