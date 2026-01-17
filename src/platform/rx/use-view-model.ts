import { useEffect, useMemo, useReducer } from "preact/hooks";
import { ON_CHANGE } from "./rx.ts";

export interface ViewModelLifecycle {
  onInit?(): any | Promise<any>;
  onDestroy?(): any | Promise<any>;
}

export function useViewModel<
  T extends EventTarget & ViewModelLifecycle,
  U extends Array<any>,
>(ctor: new (...args: U) => T, args: U, options?: { debugKey?: string }): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const instance = useMemo(() => new ctor(...args), [ctor, ...args]);

  useEffect(() => {
    const onChange = () => forceUpdate();
    instance.addEventListener("change", onChange);
    instance.onInit && instance.onInit();

    const extras = new Set<EventTarget>();

    // @ts-expect-error
    for (const value of Object.values(instance?.[ON_CHANGE]) || []) {
      if (!(value instanceof EventTarget)) {
        continue;
      }
      extras.add(value);
      value.addEventListener("change", onChange);
    }

    if (options?.debugKey) {
      // @ts-expect-error
      globalThis.__REACTIVE = globalThis.__REACTIVE || {};
      // @ts-expect-error
      globalThis.__REACTIVE[options.debugKey] = instance;
    }

    return () => {
      instance.removeEventListener("change", onChange);
      for (const extra of extras.values()) {
        extra.removeEventListener("change", onChange);
      }
      if (instance.onDestroy) instance.onDestroy();
    };
  }, [instance]);

  return instance;
}
