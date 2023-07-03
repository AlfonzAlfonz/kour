import L from "leaflet";
import { useSyncExternalStore } from "react";
import { appendTree, createTree } from "./tree";

type ReactListener = () => void;

export type PointStore = ReturnType<typeof createPointStore>;

export const createPointStore = (initialData: L.LatLngTuple[]) => {
  let ref = {
    tree: createTree(initialData),
  };

  let listeners: ReactListener[] = [];

  const emitChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    addPoints: (lls: L.LatLngTuple[]) => {
      for (const p of lls) {
        appendTree(ref.tree, p);
      }

      ref = { tree: ref.tree };

      emitChange();
    },
    subscribe: (listener: ReactListener) => {
      listeners = [...listeners, listener];
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot: () => ref,
  };
};

export const usePoints = (store: PointStore) =>
  useSyncExternalStore(
    (listener) => store.subscribe(listener),
    store.getSnapshot
  );
