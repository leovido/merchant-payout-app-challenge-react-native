"use strict";

/** Trigger names shared between JS orchestration and the native bridge. */

/** Unencrypted header claims returned by the native decrypt/reassembly path. */

/** Decrypted payload envelope handed from native to the JS pipeline. */

/** Snapshot of entries held in native ephemeral storage. */

/** Shape of coded errors thrown by Expo native functions. */

/** Native module contract implemented by Swift/Kotlin Expo modules. */

/** Maps a native error code string to a stable {@link HydrationErrorCode}. */
export const NATIVE_ERROR_CODE_MAP = {
  NATIVE_MODULE_UNAVAILABLE: 'NATIVE_MODULE_UNAVAILABLE',
  TTL_EXPIRED: 'TTL_EXPIRED',
  SIGNATURE_INVALID: 'SIGNATURE_INVALID',
  DECRYPTION_FAILED: 'DECRYPTION_FAILED',
  CHUNK_CORRUPTION: 'CHUNK_CORRUPTION',
  CHUNK_SEQUENCE_GAP: 'CHUNK_SEQUENCE_GAP',
  REASSEMBLY_TIMEOUT: 'REASSEMBLY_TIMEOUT',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
  MALFORMED_PAYLOAD: 'MALFORMED_PAYLOAD'
};
//# sourceMappingURL=types.js.map