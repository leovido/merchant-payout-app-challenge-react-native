"use strict";

import { HydrationError } from "../errors.js";
import { computeDiff } from "../patch/index.js";
import { routeContext } from "../routing/index.js";
import { assertVersionInRange, validateWithSchema } from "../validation/index.js";

/**
 * JS-layer input to the pipeline: the decrypted, reassembled payload handed
 * up by the native bridge. The native layer owns decryption, signature, TTL,
 * and chunk reassembly; the pipeline owns validation, routing, and diffing.
 */

function coerceError(err) {
  return HydrationError.is(err) ? err : new HydrationError('Unexpected hydration failure', {
    code: 'MALFORMED_PAYLOAD',
    cause: err
  });
}

/**
 * Pure orchestration for a single hydration attempt.
 *
 * Enforces version bounds, routes the context, validates the payload, then
 * computes the {@link import('../types').DeepPatch} from `base` to the
 * validated state. Never applies the patch — the client owns application
 * timing. On failure, notifies `onError` and returns a typed failure result
 * carrying `base` as the fallback.
 */
export function runHydration(envelope, base, options) {
  try {
    assertVersionInRange(envelope.claims.v, options.minVersion, options.maxVersion);
    const context = routeContext(envelope.claims);
    const validated = validateWithSchema(options.schema, envelope.state);
    const patch = computeDiff(base, validated);
    return {
      ok: true,
      patch,
      version: envelope.claims.v,
      context
    };
  } catch (err) {
    const error = coerceError(err);
    options.onError?.(error);
    return {
      ok: false,
      error,
      fallback: base
    };
  }
}
/**
 * Serialises overlapping hydration triggers so only the newest submission is
 * applied. Call {@link beginAttempt} when a trigger starts (before any async
 * work) so late native resolves cannot supersede a newer attempt. Requests are
 * processed one at a time; superseded work is skipped before `run()` when
 * possible, and stale completions are reported via `onWarn` without reaching
 * `onResult`.
 */
export class HydrationQueue {
  generation = 0;
  tail = Promise.resolve();
  constructor(onResult, onWarn) {
    this.onResult = onResult;
    this.onWarn = onWarn;
  }

  /** Reserve the next attempt generation before awaiting the hydration source. */
  beginAttempt() {
    return ++this.generation;
  }
  isCurrentAttempt(generation) {
    return generation === this.generation;
  }
  submit(request, generation) {
    const promise = this.tail.then(() => this.processRequest(request, generation));
    this.tail = promise.catch(() => undefined);
    return promise;
  }
  warnStale(reqId) {
    this.onWarn?.(`Discarded stale hydration request: ${reqId}`);
  }
  async processRequest(request, generation) {
    if (!this.isCurrentAttempt(generation)) {
      this.warnStale(request.reqId);
      return;
    }
    const result = await request.run();
    if (!this.isCurrentAttempt(generation)) {
      this.warnStale(request.reqId);
      return;
    }
    this.onResult(result);
  }
}
//# sourceMappingURL=pipeline.js.map