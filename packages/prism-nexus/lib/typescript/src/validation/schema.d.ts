import type { SchemaValidator } from '../types.js';
/**
 * Enforce strict, inclusive `[minVersion, maxVersion]` version bounds.
 *
 * There are no silent fallbacks: a version outside the window, or a
 * non-integer version, throws {@link HydrationError} with
 * `SCHEMA_VERSION_MISMATCH`.
 */
export declare function assertVersionInRange(version: number, minVersion: number, maxVersion: number): void;
/**
 * Validate and narrow `input` using `schema`, translating any thrown validation
 * error into a {@link HydrationError} with `SCHEMA_VALIDATION_FAILED` while
 * preserving the original error as `cause`.
 */
export declare function validateWithSchema<T>(schema: SchemaValidator<T>, input: unknown): T;
//# sourceMappingURL=schema.d.ts.map