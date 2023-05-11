import L from "leaflet";
import { DEFAULT_ZOOM } from ".";

type ReactListener = () => void;

export type PointStore = ReturnType<typeof createPointStore>;

export const createPointStore = (map: L.Map) => {
  let loaded = false;
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

      if (!loaded) {
        map.setView(coords.at(-1)!, DEFAULT_ZOOM);
      }
      loaded = true;

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
