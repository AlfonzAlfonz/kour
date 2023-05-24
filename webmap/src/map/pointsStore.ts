import L from "leaflet";

type ReactListener = () => void;

export type PointStore = ReturnType<typeof createPointStore>;

export const createPointStore = () => {
  let points: L.LatLngTuple[] = [];

  let listeners: ReactListener[] = [];

  const emitChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    addPoints: (coords: L.LatLngTuple[]) => {
      points = [...points, ...coords];

      emitChange();
    },
    subscribe: (listener: ReactListener) => {
      listeners = [...listeners, listener];
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot: () => points,
  };
};
