import L from "leaflet";
import { DEFAULT_ZOOM, TILE_SIZE } from "../config";
import { featureFlags } from "../featureFlags";
import { ReactLayer } from "./ReactPointLayer";

export const createMap = (initialMapType: string) => {
  const map = L.map("map", {
    attributionControl: false,
    zoomSnap: featureFlags.debugControls ? 1 : 0,
    maxZoom: 18,
    zoomControl: featureFlags.debugControls ? true : false,
    inertiaMaxSpeed: 300,
  }).setView([50.085448, 14.446865], DEFAULT_ZOOM);

  const tileLayer = L.tileLayer(initialMapType, { tileSize: TILE_SIZE }).addTo(
    map
  );

  const pointLayer = new ReactLayer();
  map.addLayer(pointLayer);

  const marker = L.marker([0, 0], {
    icon: L.divIcon({ html: createEl("div", { class: "user-marker" }) }),
  });
  marker.addTo(map);

  return {
    map,
    tileLayer,
    pointLayer,
    marker,
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
