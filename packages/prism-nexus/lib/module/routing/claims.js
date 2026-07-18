"use strict";

import { HydrationError } from "../errors.js";
/** All routable hydration contexts, in precedence order. */
export const HYDRATION_CONTEXTS = ['session', 'guest', 'ephemeral'];

/**
 * Unencrypted payload header claims used purely for routing. Routing never
 * reads URL query parameters; only these signed claims decide the context.
 */

export function isHydrationContext(value) {
  return typeof value === 'string' && HYDRATION_CONTEXTS.includes(value);
}

/**
 * Resolve the {@link HydrationContext} from payload claims. Throws
 * {@link HydrationError} with `CONTEXT_ROUTING_FAILED` when the `ctx` claim is
 * missing or unrecognised — there is no default context.
 */
export function routeContext(claims) {
  if (!isHydrationContext(claims.ctx)) {
    throw new HydrationError(`Unroutable hydration context: ${JSON.stringify(claims.ctx)}`, {
      code: 'CONTEXT_ROUTING_FAILED',
      details: {
        ctx: claims.ctx,
        allowed: HYDRATION_CONTEXTS
      }
    });
  }
  return claims.ctx;
}
//# sourceMappingURL=claims.js.map