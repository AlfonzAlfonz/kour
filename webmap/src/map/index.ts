import L from "leaflet";
import { PointStore, createPointStore } from "./pointsStore";
import { ReactLayer } from "./ReactPointLayer";

export interface WebMap {
  leafletMap: L.Map;
  store: PointStore;
}

export const DEFAULT_ZOOM = 16;
export const FOG_SIZE = 8;

export const createMap = (): WebMap => {
  const leafletMap = L.map("map", {
    attributionControl: false,
    zoomSnap: import.meta.env.MODE === "debug" ? 1 : 0,
    maxZoom: 18,
    zoomControl: import.meta.env.MODE === "debug" ? true : false,
  }).setView([50.085448, 14.446865], DEFAULT_ZOOM);

  L.tileLayer(
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cHdSuknoOcLSEePavjoJ"
  ).addTo(leafletMap);

  const store = createPointStore(leafletMap);

  const layer = new ReactLayer();
  layer.store = store;
  layer.map = leafletMap;
  leafletMap.addLayer(layer);

  return {
    leafletMap,
    store,
  };
};
