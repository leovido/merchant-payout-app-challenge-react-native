"use strict";

import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { HydrationQueue } from "../hydration/index.js";
import { createHydrationDispatch } from "./dispatch.js";
/**
 * Wires hydration triggers to React lifecycle: an initial `appLaunch` attempt,
 * a foreground (`background`/`inactive` -> `active`) subscription with cleanup,
 * and an imperative `hydrateNow`. Config is read through a ref so callback and
 * source changes never resubscribe or recreate the request queue.
 */
export function useHydrationController(config) {
  const configRef = useRef(config);
  configRef.current = config;
  const queueRef = useRef(null);
  const inFlightRef = useRef(false);
  const pendingTriggerRef = useRef(null);
  const inFlightPromiseRef = useRef(null);
  if (queueRef.current === null) {
    queueRef.current = new HydrationQueue(result => configRef.current.onHydrate(result), msg => configRef.current.onWarn?.(msg));
  }
  const dispatch = useCallback(trigger => {
    const cfg = configRef.current;
    const run = createHydrationDispatch({
      source: cfg.source,
      getBaseState: cfg.getBaseState ?? (() => ({})),
      options: cfg,
      queue: queueRef.current
    });
    return run(trigger);
  }, []);
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const coalescedDispatch = useCallback(trigger => {
    if (inFlightRef.current) {
      pendingTriggerRef.current = trigger;
      return inFlightPromiseRef.current ?? Promise.resolve();
    }
    inFlightRef.current = true;
    const loop = async () => {
      let current = trigger;
      while (current !== null) {
        await dispatchRef.current(current);
        current = pendingTriggerRef.current;
        pendingTriggerRef.current = null;
      }
    };
    const promise = loop().finally(() => {
      inFlightRef.current = false;
      inFlightPromiseRef.current = null;
    });
    inFlightPromiseRef.current = promise;
    return promise;
  }, []);
  useEffect(() => {
    coalescedDispatch('appLaunch').catch(() => undefined);
  }, [coalescedDispatch]);
  useEffect(() => {
    let previous = AppState.currentState;
    const subscription = AppState.addEventListener('change', next => {
      const cameToForeground = (previous === 'background' || previous === 'inactive') && next === 'active';
      previous = next;
      if (cameToForeground) {
        coalescedDispatch('appStateActive').catch(() => undefined);
      }
    });
    return () => subscription.remove();
  }, [coalescedDispatch]);
  const hydrateNow = useCallback(() => {
    coalescedDispatch('manual').catch(() => undefined);
  }, [coalescedDispatch]);
  return {
    hydrateNow
  };
}
//# sourceMappingURL=useHydrationController.js.map