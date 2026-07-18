/** Path segment that locates a hydration request in a deep link. */
export declare const HYDRATE_PATH = "://hydrate/";
/**
 * Pure-JS deep-link extractor. Routing context is never read from the URL —
 * only the opaque `reqId` after `://hydrate/` is returned.
 */
export declare function extractReqIdFromUrl(url: string): string | null;
//# sourceMappingURL=extractReqId.d.ts.map