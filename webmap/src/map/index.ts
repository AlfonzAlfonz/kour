import L from "leaflet";
import { PointStore, createPointStore } from "./pointsStore";
import { ReactLayer } from "./ReactPointLayer";

export interface WebMap {
  leafletMap: L.Map;
  store: PointStore;

  updatePosition: (pos: L.LatLngTuple) => unknown;
  updateMapType: (type: string) => unknown;
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

  const tileLayer = L.tileLayer(
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cHdSuknoOcLSEePavjoJ"
  ).addTo(leafletMap);

  const store = createPointStore();

  const layer = new ReactLayer();
  layer.store = store;
  layer.map = leafletMap;
  leafletMap.addLayer(layer);

  const marker = L.marker([0, 0], {
    icon: L.divIcon({ html: createEl("div", { class: "user-marker" }) }),
  });
  marker.addTo(leafletMap);

  return {
    leafletMap,
    store,
    updatePosition: (pos) => {
      marker.setLatLng(pos);
      leafletMap.setView(pos);
    },
    updateMapType: (type) => {
      tileLayer.setUrl(type);
    },
  };
};

const createEl = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attrs: Record<string, string | number>
) => {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(key, String(val));
  }
  return el;
};
