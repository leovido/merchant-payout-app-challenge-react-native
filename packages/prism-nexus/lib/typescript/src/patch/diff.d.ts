import type { DeepPatch } from '../types.js';
type Json = unknown;
/** Structural deep-equality for JSON-compatible values. */
export declare function deepEqual(a: Json, b: Json): boolean;
/**
 * Compute a minimal RFC 6902 patch that transforms `base` into `next`.
 *
 * Objects and arrays are diffed structurally; other values are treated as
 * leaves and produce a single `replace`. The result is deterministic: object
 * keys follow insertion order and array changes are emitted tail-first on
 * removal to keep indices valid during sequential application.
 */
export declare function computeDiff<T>(base: T, next: T): DeepPatch<T>[];
export {};
//# sourceMappingURL=diff.d.ts.map