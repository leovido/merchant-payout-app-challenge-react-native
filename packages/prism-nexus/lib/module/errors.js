"use strict";

/**
 * Canonical taxonomy of hydration failure codes.
 *
 * Codes are stable string identifiers so that clients can branch on
 * `error.code` without depending on message text. New codes may be added in
 * minor releases; existing codes never change meaning.
 */
export const HYDRATION_ERROR_CODES = ['SCHEMA_VERSION_MISMATCH', 'SCHEMA_VALIDATION_FAILED', 'SIGNATURE_INVALID', 'DECRYPTION_FAILED', 'CHUNK_CORRUPTION', 'CHUNK_SEQUENCE_GAP', 'REASSEMBLY_TIMEOUT', 'TTL_EXPIRED', 'STORAGE_QUOTA_EXCEEDED', 'CONTEXT_ROUTING_FAILED', 'NATIVE_MODULE_UNAVAILABLE', 'STALE_REQUEST', 'MALFORMED_PAYLOAD'];
/**
 * Error raised for every hydration failure. Carries a stable {@link HydrationErrorCode}
 * so callers can react without string matching. The SDK never logs; it surfaces
 * these to the client via `onError`.
 */
export class HydrationError extends Error {
  constructor(message, options) {
    super(message, options.cause !== undefined ? {
      cause: options.cause
    } : undefined);
    this.name = 'HydrationError';
    this.code = options.code;
    this.details = options.details;

    // Restore prototype chain for reliable `instanceof` across transpile targets.
    Object.setPrototypeOf(this, HydrationError.prototype);
  }
  static is(value) {
    return value instanceof HydrationError;
  }
}
//# sourceMappingURL=errors.js.map