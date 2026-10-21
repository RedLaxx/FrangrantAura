import { useCallback, useEffect, useState } from "react";

import {
  SAVE_KEY,
  defaultSave,
  loadSave,
  saveSave,
  type SaveState,
} from "./game/progress.ts";

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export interface SaveApi {
  state: SaveState;
  update: (mutator: (draft: SaveState) => void) => void;
  reset: () => void;
}

export function useSave(): SaveApi {
  const [state, setState] = useState<SaveState>(() => loadSave());

  useEffect(() => {
    saveSave(state);
  }, [state]);

  const update = useCallback((mutator: (draft: SaveState) => void) => {
    setState((previous) => {
      const draft = clone(previous);
      mutator(draft);
      return draft;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch {
      // ignore
    }
    setState(defaultSave());
  }, []);

  return { state, update, reset };
}
