import type { HydrationContext } from '../types.js';
/** All routable hydration contexts, in precedence order. */
export declare const HYDRATION_CONTEXTS: readonly HydrationContext[];
/**
 * Unencrypted payload header claims used purely for routing. Routing never
 * reads URL query parameters; only these signed claims decide the context.
 */
export interface HydrationClaims {
    /** Schema version of the payload. */
    v: number;
    /** Creation timestamp (unix seconds). */
    ts: number;
    /** Target context. */
    ctx: string;
    /** Key id used to select the decryption key. */
    kid: string;
}
export declare function isHydrationContext(value: unknown): value is HydrationContext;
/**
 * Resolve the {@link HydrationContext} from payload claims. Throws
 * {@link HydrationError} with `CONTEXT_ROUTING_FAILED` when the `ctx` claim is
 * missing or unrecognised — there is no default context.
 */
export declare function routeContext(claims: Pick<HydrationClaims, 'ctx'>): HydrationContext;
//# sourceMappingURL=claims.d.ts.map