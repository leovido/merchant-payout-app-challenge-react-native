import { type BenchmarkSample } from './patchBenchmark.js';
export interface HydrationBenchmarkOptions {
    itemCount?: number;
    iterations?: number;
}
/** Benchmark the JS validation + diff pipeline (`runHydration`). */
export declare function runHydrationBenchmarks(options?: HydrationBenchmarkOptions): BenchmarkSample[];
//# sourceMappingURL=hydrationBenchmark.d.ts.map