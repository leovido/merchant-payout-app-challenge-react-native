export type { HydrationErrorCode, HydrationErrorOptions } from './errors.js';
export { HYDRATION_ERROR_CODES, HydrationError } from './errors.js';
export type { HydrationEnvelope, ScheduledRequest } from './hydration/index.js';
export { HydrationQueue, runHydration } from './hydration/index.js';
export { multiply } from './multiply';
export type { HydrationWireChunk, HydrationWirePayload, NativeHydrationClaims, NativeHydrationEnvelope, NativeHydrationSourceOptions, NativeHydrationTrigger, NativeHydratorConfigureOptions, NativeStorageSnapshot, PrismNexusHydratorNativeSpec, SealAndStorePayloadInput, } from './native/index.js';
export { configureNativeHydrator, createNativeHydrationSource, estimateChunkCount, estimateSingleChunkCiphertextBytes, extractHydrationReqId, extractReqIdFromUrl, getNativeHydratorModule, inspectNativeHydrationStorage, isNativeHydratorAvailable, mapNativeError, NATIVE_CHUNK_PLAINTEXT_SLICE, NATIVE_CHUNK_THRESHOLD_BYTES, NATIVE_GCM_TAG_BYTES, NATIVE_REASSEMBLY_TIMEOUT_MS, purgeExpiredHydrationEntries, requireNativeHydratorModule, resolvePlaintextSliceSize, sealAndStoreHydrationPayload, shouldChunkPlaintext, storeHydrationPayload, } from './native/index.js';
export { appendPointer, applyPatch, buildPointer, computeDiff, deepEqual, escapeToken, parsePointer, unescapeToken, } from './patch/index.js';
export type { HydrationDispatchDeps, HydrationSource, HydrationTrigger, HydratorContextValue, HydratorController, HydratorControllerConfig, HydratorProviderProps, } from './provider/index.js';
export { createHydrationDispatch, HydratorProvider, useHydrationController, useHydrator, } from './provider/index.js';
export type { HydrationClaims } from './routing/index.js';
export { HYDRATION_CONTEXTS, isHydrationContext, routeContext, } from './routing/index.js';
export type { CustomResolver, DeepPatch, HydrationContext, HydrationOptions, HydrationResult, MergeStrategy, SchemaValidator, } from './types.js';
export { DEFAULT_CHUNK_THRESHOLD } from './types.js';
export { assertVersionInRange, validateWithSchema } from './validation/index.js';
//# sourceMappingURL=index.d.ts.map