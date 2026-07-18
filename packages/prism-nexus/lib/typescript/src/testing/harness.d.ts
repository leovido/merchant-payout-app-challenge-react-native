import type { HydrationEnvelope } from '../hydration/index.js';
import type { HydrationSource } from '../provider/index.js';
import { type MockEnvelopeInput } from './mock.js';
import { TestHydrationStore } from './store.js';
export interface TestHydratorHarness {
    /** In-memory store backing the mock source. */
    store: TestHydrationStore;
    /** {@link HydrationSource} wired to `store` for `HydratorProvider`. */
    source: HydrationSource;
    /** Seed the next envelope the source will resolve. */
    seed(input: MockEnvelopeInput): HydrationEnvelope;
    /** Clear stored envelopes and recorded errors. */
    reset(): void;
}
/** Factory for deterministic unit/integration tests around the hydrator. */
export declare function createTestHydratorHarness(): TestHydratorHarness;
//# sourceMappingURL=harness.d.ts.map