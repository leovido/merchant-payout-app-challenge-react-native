"use strict";

import { mapNativeError } from "./mapNativeError.js";
import { requireNativeHydratorModule } from "./PrismNexusHydratorModule.js";
/** Persist a signed wire payload in native ephemeral storage. */
export async function storeHydrationPayload(payload) {
  const module = requireNativeHydratorModule();
  try {
    await module.storePayload(payload);
  } catch (cause) {
    throw mapNativeError(cause);
  }
}
/**
 * Encrypt, sign, and store a payload using device-bound native keys.
 * Requires native `testMode` (via {@link configureNativeHydrator}) until a
 * trusted external signer is integrated.
 */
export async function sealAndStoreHydrationPayload(input) {
  const module = requireNativeHydratorModule();
  try {
    return await module.sealAndStorePayload(input);
  } catch (cause) {
    throw mapNativeError(cause);
  }
}
//# sourceMappingURL=storePayload.js.map