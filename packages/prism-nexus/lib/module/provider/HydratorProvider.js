"use strict";

import { createContext, useContext, useMemo } from 'react';
import { useHydrationController } from "./useHydrationController.js";
import { jsx as _jsx } from "react/jsx-runtime";
const HydratorContext = /*#__PURE__*/createContext(null);
/**
 * Declarative entry point. Mount once near the app root: it hydrates on launch
 * and on return to the foreground, delivering every result to `onHydrate`.
 * Children may call {@link useHydrator} to trigger `hydrateNow()`.
 */
export function HydratorProvider(props) {
  const {
    children,
    ...config
  } = props;
  const {
    hydrateNow
  } = useHydrationController(config);
  const value = useMemo(() => ({
    hydrateNow
  }), [hydrateNow]);
  return /*#__PURE__*/_jsx(HydratorContext.Provider, {
    value: value,
    children: children
  });
}

/** Access the enclosing provider's imperative hydration controls. */
export function useHydrator() {
  const context = useContext(HydratorContext);
  if (context === null) {
    throw new Error('useHydrator must be used within a HydratorProvider');
  }
  return context;
}
//# sourceMappingURL=HydratorProvider.js.map