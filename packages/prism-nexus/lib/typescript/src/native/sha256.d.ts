/**
 * Minimal SHA-256 hex digest for UTF-8 strings.
 *
 * Kept dependency-free so the public JS bundle works in React Native / Metro
 * (no `node:crypto`) and mirrors the native HydratorEncoding canonicalization
 * used for chunk HMAC aggregation.
 */
/** SHA-256 digest of a UTF-8 string as lowercase hex. */
export declare function sha256HexFromUtf8(input: string): string;
//# sourceMappingURL=sha256.d.ts.map