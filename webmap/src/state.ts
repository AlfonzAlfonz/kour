import { createMap } from "./map";
import { PointStore, createPointStore } from "./pointStore";

export interface AppState {
  store: PointStore;
  map: L.Map;
  tileLayer: L.TileLayer;
  marker: L.Marker;
}

export const initState = (
  initialLls: L.LatLngTuple[],
  initialMapType: string
) => {
  const store = createPointStore(initialLls);

  const { map, tileLayer, marker } = createMap(initialMapType);

  if (initialLls.length) {
    const ll = initialLls.at(-1)!;
    map.setView(ll);
    marker.setLatLng(ll);
  }

  (window as any).__appState = {
    store,
    map,
    tileLayer,
    marker,
  };
};

export const getAppState = (): AppState => {
  const state = (window as any).__appState;
  if (state == null) throw new Error("State is not initialized");
  return (window as any).__appState;
};
