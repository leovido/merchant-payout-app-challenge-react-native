"use strict";

export { estimateChunkCount, estimateSingleChunkCiphertextBytes, NATIVE_CHUNK_PLAINTEXT_SLICE, NATIVE_CHUNK_THRESHOLD_BYTES, NATIVE_GCM_TAG_BYTES, NATIVE_REASSEMBLY_TIMEOUT_MS, resolvePlaintextSliceSize, shouldChunkPlaintext } from "./chunking.js";
export { configureNativeHydrator } from "./configure.js";
export { extractReqIdFromUrl, HYDRATE_PATH } from "./extractReqId.js";
export { mapNativeError } from "./mapNativeError.js";
export { createNativeHydrationSource, extractHydrationReqId, inspectNativeHydrationStorage, purgeExpiredHydrationEntries } from "./nativeHydrationSource.js";
export { __resetNativeHydratorModuleCacheForTests, getNativeHydratorModule, isNativeHydratorAvailable, requireNativeHydratorModule } from "./PrismNexusHydratorModule.js";
export { sealAndStoreHydrationPayload, storeHydrationPayload } from "./storePayload.js";
export { NATIVE_ERROR_CODE_MAP } from "./types.js";
export { buildSignatureMessage, computeChunksHmac, NATIVE_KID_V1, NATIVE_STORAGE_QUOTA_BYTES, NATIVE_TTL_SECONDS } from "./wirePayload.js";
//# sourceMappingURL=index.js.map