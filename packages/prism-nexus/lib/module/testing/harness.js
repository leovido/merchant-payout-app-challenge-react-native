"use strict";

import { createMockEnvelope, createMockHydrationSource } from "./mock.js";
import { TestHydrationStore } from "./store.js";
/** Factory for deterministic unit/integration tests around the hydrator. */
export function createTestHydratorHarness() {
  const store = new TestHydrationStore();
  const source = createMockHydrationSource(store);
  return {
    store,
    source,
    seed(input) {
      const envelope = createMockEnvelope(input);
      store.put(envelope);
      return envelope;
    },
    reset() {
      store.reset();
    }
  };
}
//# sourceMappingURL=harness.js.map