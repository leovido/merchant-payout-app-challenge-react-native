import type { DeepPatch } from '../types.js';
/**
 * @experimental Applies an RFC 6902 JSON Patch to `target`, returning a new
 * object reference so React reconciliation sees a changed value. Nodes along
 * each mutated path are shallow-cloned (structural sharing); untouched
 * branches keep their original references.
 *
 * Marked experimental due to the dynamic-typing limits of applying arbitrary
 * pointers against strongly-typed RN state slices. Prefer a typed reducer for
 * critical production slices.
 */
export declare function applyPatch<T>(target: T, patch: DeepPatch<T>[]): T;
//# sourceMappingURL=applyPatch.d.ts.map