"use strict";

import { appendPointer } from "./jsonPointer.js";
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isPrimitiveEqual(a, b) {
  return a === b || Number.isNaN(a) && Number.isNaN(b);
}

/** Structural deep-equality for JSON-compatible values. */
export function deepEqual(a, b) {
  if (isPrimitiveEqual(a, b)) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    return aKeys.every(key => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
  }
  return false;
}
function diffInto(base, next, pointer, out) {
  if (deepEqual(base, next)) {
    return;
  }

  // Arrays and objects are diffed structurally; anything else is a leaf replace.
  if (Array.isArray(base) && Array.isArray(next)) {
    diffArray(base, next, pointer, out);
    return;
  }
  if (isObject(base) && isObject(next)) {
    diffObject(base, next, pointer, out);
    return;
  }
  out.push({
    op: 'replace',
    path: pointer,
    value: next
  });
}
function diffArray(base, next, pointer, out) {
  const shared = Math.min(base.length, next.length);
  for (let i = 0; i < shared; i += 1) {
    diffInto(base[i], next[i], appendPointer(pointer, i), out);
  }
  // Append new tail entries.
  for (let i = base.length; i < next.length; i += 1) {
    out.push({
      op: 'add',
      path: appendPointer(pointer, i),
      value: next[i]
    });
  }
  // Remove surplus tail entries from the end to keep indices stable.
  for (let i = base.length - 1; i >= next.length; i -= 1) {
    out.push({
      op: 'remove',
      path: appendPointer(pointer, i)
    });
  }
}
function diffObject(base, next, pointer, out) {
  for (const key of Object.keys(next)) {
    const childPointer = appendPointer(pointer, key);
    if (Object.hasOwn(base, key)) {
      diffInto(base[key], next[key], childPointer, out);
    } else {
      out.push({
        op: 'add',
        path: childPointer,
        value: next[key]
      });
    }
  }
  for (const key of Object.keys(base)) {
    if (!Object.hasOwn(next, key)) {
      out.push({
        op: 'remove',
        path: appendPointer(pointer, key)
      });
    }
  }
}

/**
 * Compute a minimal RFC 6902 patch that transforms `base` into `next`.
 *
 * Objects and arrays are diffed structurally; other values are treated as
 * leaves and produce a single `replace`. The result is deterministic: object
 * keys follow insertion order and array changes are emitted tail-first on
 * removal to keep indices valid during sequential application.
 */
export function computeDiff(base, next) {
  const out = [];
  diffInto(base, next, '', out);
  return out;
}
//# sourceMappingURL=diff.js.map