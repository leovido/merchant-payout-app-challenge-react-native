/** AES-GCM authentication tag size appended to each encrypted chunk. */
export declare const NATIVE_GCM_TAG_BYTES = 16;
/** Plaintext slice size once multi-chunk transport is required. */
export declare const NATIVE_CHUNK_PLAINTEXT_SLICE = 4096;
/** Default encrypted-payload threshold before multi-chunk transport (20 KiB). */
export declare const NATIVE_CHUNK_THRESHOLD_BYTES: number;
/** Default async reassembly timeout passed to the native worker (30s). */
export declare const NATIVE_REASSEMBLY_TIMEOUT_MS = 30000;
/**
 * Estimate ciphertext bytes for a single AES-GCM chunk sealing `plaintextBytes`
 * of state (plaintext + authentication tag).
 */
export declare function estimateSingleChunkCiphertextBytes(plaintextBytes: number): number;
/**
 * Whether plaintext should be split into transport chunks. Payloads whose
 * single-chunk ciphertext fits within `threshold` stay as one chunk; larger
 * payloads are sliced at {@link NATIVE_CHUNK_PLAINTEXT_SLICE}.
 */
export declare function shouldChunkPlaintext(plaintextBytes: number, threshold?: number): boolean;
/**
 * Plaintext bytes per transport chunk for a payload of `plaintextBytes`.
 * Returns the full payload size when chunking is not required.
 */
export declare function resolvePlaintextSliceSize(plaintextBytes: number, threshold?: number): number;
/** Expected transport chunk count after sealing `plaintextBytes`. */
export declare function estimateChunkCount(plaintextBytes: number, threshold?: number): number;
//# sourceMappingURL=chunking.d.ts.map