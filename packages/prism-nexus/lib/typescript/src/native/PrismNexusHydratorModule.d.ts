import type { PrismNexusHydratorNativeSpec } from './types.js';
/** Reset the module cache. Intended for tests only. */
export declare function __resetNativeHydratorModuleCacheForTests(): void;
/**
 * Lazily load the Expo native module. Returns `null` when autolinking did not
 * register the module (e.g. web, Jest, or a non-Expo host).
 */
export declare function getNativeHydratorModule(): PrismNexusHydratorNativeSpec | null;
/** Whether the Expo hydrator native module is linked and loadable. */
export declare function isNativeHydratorAvailable(): boolean;
/**
 * Require the native module or throw {@link HydrationError} with
 * `NATIVE_MODULE_UNAVAILABLE`. Use in production hydration paths.
 */
export declare function requireNativeHydratorModule(): PrismNexusHydratorNativeSpec;
//# sourceMappingURL=PrismNexusHydratorModule.d.ts.map