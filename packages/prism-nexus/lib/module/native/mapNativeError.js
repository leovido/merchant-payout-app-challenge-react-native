"use strict";

import { HydrationError } from "../errors.js";
import { NATIVE_ERROR_CODE_MAP } from "./types.js";
function isNativeErrorPayload(value) {
  return typeof value === 'object' && value !== null && 'code' in value;
}
function mapCode(code) {
  return NATIVE_ERROR_CODE_MAP[code] ?? 'MALFORMED_PAYLOAD';
}

/**
 * Translate an Expo {@link CodedException} (or compatible payload) into a
 * typed {@link HydrationError} for the JS pipeline.
 */
export function mapNativeError(error) {
  if (HydrationError.is(error)) {
    return error;
  }
  if (isNativeErrorPayload(error)) {
    const message = typeof error.message === 'string' && error.message.length > 0 ? error.message : 'Native hydration failed';
    return new HydrationError(message, {
      code: mapCode(String(error.code)),
      details: error.details,
      cause: error
    });
  }
  if (error instanceof Error) {
    return new HydrationError(error.message, {
      code: 'MALFORMED_PAYLOAD',
      cause: error
    });
  }
  return new HydrationError('Native hydration failed', {
    code: 'MALFORMED_PAYLOAD',
    cause: error
  });
}
//# sourceMappingURL=mapNativeError.js.map