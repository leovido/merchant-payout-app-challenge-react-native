"use strict";

/**
 * Where a hydration payload is applied. Routed via signed payload claims,
 * never via URL query parameters.
 */

/**
 * A single RFC 6902 JSON Patch operation. `T` is a phantom type used to keep
 * patches associated with their target state shape at call sites.
 */

/**
 * Validates and narrows unknown input into `T`. `zod`'s `ZodType` satisfies
 * this structurally via its `parse` method, so schemas can be passed directly.
 */

/** User-supplied resolver for merging a decoded patch into current state. */

/** Conflict-resolution strategy applied by the client, not the SDK. */

/**
 * Result handed to `onHydrate`. A discriminated union on `ok`: success carries
 * a patch to apply, failure carries a typed error plus a partial fallback.
 */

/** Declarative configuration for a hydration pipeline. */

/** Default chunking threshold: 20 KiB of encrypted payload. */
export const DEFAULT_CHUNK_THRESHOLD = 20 * 1024;
//# sourceMappingURL=types.js.map