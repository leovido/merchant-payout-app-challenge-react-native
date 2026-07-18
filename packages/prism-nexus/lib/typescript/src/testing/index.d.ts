import { TestHydrationStore } from './store.js';
export { mergeHydrationFallback, resolveHydrationResult } from './fallback.js';
export type { TestHydratorHarness } from './harness.js';
export { createTestHydratorHarness } from './harness.js';
export type { ExtractedRequest, MockEnvelopeInput, MockExtractorInput, } from './mock.js';
export { createMockEnvelope, createMockHydrationSource, mockHydratorExtractor, randomReqId, } from './mock.js';
export type { HydrationStateSnapshot, StoredEntry } from './store.js';
export { TestHydrationStore } from './store.js';
/** Shared store powering the module-level inspection helpers below. */
export declare const defaultTestStore: TestHydrationStore;
/** Snapshot of the shared test store: stored ids, live count, and errors. */
export declare function inspectHydrationState(): import("./store.js").HydrationStateSnapshot;
/** Expire every entry in the shared test store, simulating a TTL sweep. */
export declare function simulateTTLExpiry(): void;
//# sourceMappingURL=index.d.ts.map