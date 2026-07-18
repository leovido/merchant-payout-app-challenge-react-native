/**
 * RFC 6901 JSON Pointer helpers.
 *
 * A pointer is a string of `/`-separated, escaped reference tokens. The empty
 * string points at the whole document. `~1` decodes to `/` and `~0` to `~`.
 */
/** Escape a single reference token for embedding in a pointer. */
export declare function escapeToken(token: string): string;
/** Decode a single escaped reference token. Order matters: `~1` before `~0`. */
export declare function unescapeToken(token: string): string;
/** Parse a pointer into its decoded reference tokens. */
export declare function parsePointer(pointer: string): string[];
/** Build a pointer from decoded reference tokens. */
export declare function buildPointer(tokens: readonly string[]): string;
/** Append a decoded token to a pointer, returning a new pointer. */
export declare function appendPointer(pointer: string, token: string | number): string;
//# sourceMappingURL=jsonPointer.d.ts.map