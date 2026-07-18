/** Single encrypted chunk in a wire-format hydration payload. */
export interface HydrationWireChunk {
    seq: number;
    size: number;
    /** Base64-encoded AES-GCM IV (12 bytes). */
    iv: string;
    /** Lowercase hex SHA-256 of the ciphertext bytes in `data`. */
    hmac: string;
    /** Base64url-encoded AES-GCM ciphertext (includes authentication tag). */
    data: string;
}
/**
 * On-disk / on-wire hydration payload. Header fields are unencrypted; state
 * lives inside AES-GCM encrypted chunk(s).
 */
export interface HydrationWirePayload {
    reqId: string;
    v: number;
    ts: number;
    ctx: string;
    kid: string;
    /** Base64-encoded Ed25519 signature. */
    sig: string;
    chunks: HydrationWireChunk[];
}
export interface NativeHydratorConfigureOptions {
    /** Skips TTL enforcement and allows seal-and-store helpers. */
    testMode?: boolean;
    /**
     * Encrypted single-chunk size above which payloads are split for transport.
     * Defaults to 20 KiB.
     */
    chunkThreshold?: number;
    /** Async native reassembly timeout in milliseconds. Defaults to 30s. */
    reassemblyTimeoutMs?: number;
}
/** Canonical TTL for ephemeral native storage (seconds). */
export declare const NATIVE_TTL_SECONDS = 300;
/** Maximum native cache size before rejecting new stores (50 MiB). */
export declare const NATIVE_STORAGE_QUOTA_BYTES: number;
/** Only supported key id in MVP Phase 2. */
export declare const NATIVE_KID_V1 = "v1";
/**
 * Aggregate chunk HMACs in sequence order into a single SHA-256 hex digest.
 * Each chunk `hmac` is the lowercase hex SHA-256 of that chunk's ciphertext.
 */
export declare function computeChunksHmac(chunks: HydrationWireChunk[]): string;
/**
 * Build the Ed25519 signing/verification message:
 * `v|ts|ctx|kid|chunksHmac`
 */
export declare function buildSignatureMessage(header: Pick<HydrationWirePayload, 'v' | 'ts' | 'ctx' | 'kid'>, chunks: HydrationWireChunk[]): string;
//# sourceMappingURL=wirePayload.d.ts.map