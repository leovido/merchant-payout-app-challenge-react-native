import type { HydrationEnvelope } from '../hydration/index.js';
import type { HydrationSource } from '../provider/index.js';
import type { HydrationContext } from '../types.js';
import type { TestHydrationStore } from './store.js';
/** Result of extracting a request locator from a raw deep link payload. */
export interface ExtractedRequest {
    reqId: string;
    url: string;
}
export interface MockExtractorInput {
    reqId?: string;
    /** URI scheme for the synthesised locator; defaults to `app`. */
    scheme?: string;
}
export interface MockEnvelopeInput {
    reqId?: string;
    state: unknown;
    context?: HydrationContext;
    version?: number;
    ts?: number;
    kid?: string;
}
export declare function randomReqId(): string;
/**
 * Deterministically shaped extractor for tests: turns a raw payload descriptor
 * into a `{ reqId, url }` locator. The routing context is never encoded in the
 * URL — only in signed claims — so the URL carries just the request id.
 */
export declare function mockHydratorExtractor(input?: MockExtractorInput): ExtractedRequest;
/** Build a fully-formed {@link HydrationEnvelope} for tests. */
export declare function createMockEnvelope(input: MockEnvelopeInput): HydrationEnvelope;
/**
 * A {@link HydrationSource} backed by a {@link TestHydrationStore}. Each trigger
 * consumes the next live entry, letting tests drive `appLaunch`/`hydrateNow`
 * flows deterministically.
 */
export declare function createMockHydrationSource(store: TestHydrationStore): HydrationSource;
//# sourceMappingURL=mock.d.ts.map