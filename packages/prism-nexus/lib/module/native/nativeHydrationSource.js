"use strict";

import { extractReqIdFromUrl } from "./extractReqId.js";
import { mapNativeError } from "./mapNativeError.js";
import { getNativeHydratorModule, requireNativeHydratorModule } from "./PrismNexusHydratorModule.js";
function toHydrationEnvelope(envelope) {
  return {
    reqId: envelope.reqId,
    claims: envelope.claims,
    state: envelope.state
  };
}

/**
 * Production {@link HydrationSource} backed by the Expo native bridge.
 *
 * The native layer owns secure storage, decryption, signature verification,
 * TTL enforcement, and chunk reassembly. This adapter only maps the native
 * envelope into the JS {@link HydrationEnvelope} shape expected by
 * `runHydration`.
 */
export function createNativeHydrationSource(options = {}) {
  const requireNative = options.requireNative ?? true;
  return {
    async resolve(trigger) {
      const module = requireNative ? requireNativeHydratorModule() : getNativeHydratorModule();
      if (module === null) {
        return null;
      }
      try {
        const envelope = await module.resolveEnvelope(trigger);
        return envelope === null ? null : toHydrationEnvelope(envelope);
      } catch (cause) {
        throw mapNativeError(cause);
      }
    }
  };
}

/**
 * Extract a request id from a deep link, preferring the native implementation
 * when available and falling back to the pure-JS parser.
 */
export function extractHydrationReqId(url) {
  const module = getNativeHydratorModule();
  if (module !== null) {
    return module.extractReqId(url);
  }
  return extractReqIdFromUrl(url);
}

/** Invoke the native TTL purge sweep. Returns the number of entries removed. */
export async function purgeExpiredHydrationEntries() {
  const module = requireNativeHydratorModule();
  try {
    return await module.purgeExpired();
  } catch (cause) {
    throw mapNativeError(cause);
  }
}

/** Inspect native ephemeral storage (primarily for `testMode` / diagnostics). */
export async function inspectNativeHydrationStorage() {
  const module = requireNativeHydratorModule();
  try {
    return await module.inspectStorage();
  } catch (cause) {
    throw mapNativeError(cause);
  }
}
//# sourceMappingURL=nativeHydrationSource.js.map