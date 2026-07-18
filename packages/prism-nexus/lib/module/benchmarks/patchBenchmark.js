"use strict";

import { applyPatch } from "../patch/applyPatch.js";
import { computeDiff } from "../patch/diff.js";
/** Run `fn` for `iterations` and return timing stats. */
export function measure(name, fn, iterations) {
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) {
    fn();
  }
  const totalMs = performance.now() - start;
  return {
    name,
    iterations,
    totalMs,
    meanMs: totalMs / iterations,
    opsPerSecond: iterations / totalMs * 1000
  };
}
/** Build a moderately wide JSON tree for patch benchmarks. */
export function createNestedState(itemCount) {
  return {
    meta: {
      version: 1,
      tags: ['hydrator', 'benchmark']
    },
    items: Array.from({
      length: itemCount
    }, (_, id) => ({
      id,
      value: `item-${id}`
    }))
  };
}
const DEFAULT_ITEM_COUNT = 500;
const DEFAULT_DIFF_ITERATIONS = 200;
const DEFAULT_APPLY_ITERATIONS = 200;

/** Benchmark `computeDiff` and `applyPatch` against a nested state tree. */
export function runPatchBenchmarks(options = {}) {
  const itemCount = options.itemCount ?? DEFAULT_ITEM_COUNT;
  const diffIterations = options.diffIterations ?? DEFAULT_DIFF_ITERATIONS;
  const applyIterations = options.applyIterations ?? DEFAULT_APPLY_ITERATIONS;
  const base = createNestedState(itemCount);
  const next = createNestedState(itemCount);
  next.meta.version = 2;
  next.items[0] = {
    id: 0,
    value: 'mutated'
  };
  next.items.push({
    id: itemCount,
    value: 'added'
  });
  const patch = computeDiff(base, next);
  return [measure(`computeDiff/${itemCount}-items`, () => {
    computeDiff(base, next);
  }, diffIterations), measure(`applyPatch/${patch.length}-ops`, () => {
    applyPatch(base, patch);
  }, applyIterations)];
}

/** Format benchmark rows for console output. */
export function formatBenchmarkTable(samples) {
  const header = ['benchmark', 'iterations', 'mean_ms', 'ops_per_sec'];
  const rows = samples.map(sample => [sample.name, String(sample.iterations), sample.meanMs.toFixed(3), sample.opsPerSecond.toFixed(0)]);
  const widths = header.map((col, index) => Math.max(col.length, ...rows.map(row => row[index].length)));
  const line = cells => cells.map((cell, i) => cell.padEnd(widths[i])).join('  ');
  return [line(header), line(widths.map(w => '-'.repeat(w))), ...rows.map(line)].join('\n');
}
//# sourceMappingURL=patchBenchmark.js.map