export interface BenchmarkSample {
    name: string;
    iterations: number;
    totalMs: number;
    meanMs: number;
    opsPerSecond: number;
}
/** Run `fn` for `iterations` and return timing stats. */
export declare function measure(name: string, fn: () => void, iterations: number): BenchmarkSample;
export interface NestedState {
    meta: {
        version: number;
        tags: string[];
    };
    items: Array<{
        id: number;
        value: string;
    }>;
}
/** Build a moderately wide JSON tree for patch benchmarks. */
export declare function createNestedState(itemCount: number): NestedState;
export interface PatchBenchmarkOptions {
    itemCount?: number;
    diffIterations?: number;
    applyIterations?: number;
}
/** Benchmark `computeDiff` and `applyPatch` against a nested state tree. */
export declare function runPatchBenchmarks(options?: PatchBenchmarkOptions): BenchmarkSample[];
/** Format benchmark rows for console output. */
export declare function formatBenchmarkTable(samples: BenchmarkSample[]): string;
//# sourceMappingURL=patchBenchmark.d.ts.map