"use strict";

import { mapNativeError } from "./mapNativeError.js";
import { requireNativeHydratorModule } from "./PrismNexusHydratorModule.js";
/** Push runtime options (e.g. testMode) to the native hydrator module. */
export async function configureNativeHydrator(options) {
  const module = requireNativeHydratorModule();
  try {
    await module.configure(options);
  } catch (cause) {
    throw mapNativeError(cause);
  }
}
//# sourceMappingURL=configure.js.map