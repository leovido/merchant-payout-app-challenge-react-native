"use strict";

import { TestHydrationStore } from "./store.js";
export { mergeHydrationFallback, resolveHydrationResult } from "./fallback.js";
export { createTestHydratorHarness } from "./harness.js";
export { createMockEnvelope, createMockHydrationSource, mockHydratorExtractor, randomReqId } from "./mock.js";
export { TestHydrationStore } from "./store.js";

/** Shared store powering the module-level inspection helpers below. */
export const defaultTestStore = new TestHydrationStore();

/** Snapshot of the shared test store: stored ids, live count, and errors. */
export function inspectHydrationState() {
  return defaultTestStore.inspect();
}

/** Expire every entry in the shared test store, simulating a TTL sweep. */
export function simulateTTLExpiry() {
  defaultTestStore.expireAll();
}
//# sourceMappingURL=index.js.map