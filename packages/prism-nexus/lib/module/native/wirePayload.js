"use strict";

import { sha256HexFromUtf8 } from "./sha256.js";

/** Single encrypted chunk in a wire-format hydration payload. */

/**
 * On-disk / on-wire hydration payload. Header fields are unencrypted; state
 * lives inside AES-GCM encrypted chunk(s).
 */

/** Canonical TTL for ephemeral native storage (seconds). */
export const NATIVE_TTL_SECONDS = 300;

/** Maximum native cache size before rejecting new stores (50 MiB). */
export const NATIVE_STORAGE_QUOTA_BYTES = 50 * 1024 * 1024;

/** Only supported key id in MVP Phase 2. */
export const NATIVE_KID_V1 = 'v1';

/**
 * Aggregate chunk HMACs in sequence order into a single SHA-256 hex digest.
 * Each chunk `hmac` is the lowercase hex SHA-256 of that chunk's ciphertext.
 */
export function computeChunksHmac(chunks) {
  const sorted = [...chunks].sort((a, b) => a.seq - b.seq);
  const joined = sorted.map(chunk => chunk.hmac).join('');
  return sha256HexFromUtf8(joined);
}

/**
 * Build the Ed25519 signing/verification message:
 * `v|ts|ctx|kid|chunksHmac`
 */
export function buildSignatureMessage(header, chunks) {
  return `${header.v}|${header.ts}|${header.ctx}|${header.kid}|${computeChunksHmac(chunks)}`;
}
//# sourceMappingURL=wirePayload.js.map