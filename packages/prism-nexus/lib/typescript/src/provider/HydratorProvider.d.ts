import type { ReactNode } from 'react';
import type { HydratorControllerConfig } from './useHydrationController.js';
export interface HydratorContextValue {
    hydrateNow: () => void;
}
export interface HydratorProviderProps<T> extends HydratorControllerConfig<T> {
    children?: ReactNode;
}
/**
 * Declarative entry point. Mount once near the app root: it hydrates on launch
 * and on return to the foreground, delivering every result to `onHydrate`.
 * Children may call {@link useHydrator} to trigger `hydrateNow()`.
 */
export declare function HydratorProvider<T>(props: HydratorProviderProps<T>): import("react").JSX.Element;
/** Access the enclosing provider's imperative hydration controls. */
export declare function useHydrator(): HydratorContextValue;
//# sourceMappingURL=HydratorProvider.d.ts.map