import L from "leaflet";
import { MapState, VectorLayer } from "./VectorLayer";

export interface WebMap {
  leafletMap: L.Map;
  addPoints: (coords: L.LatLngTuple[]) => void;
  setPoints: (coords: L.LatLngTuple[]) => void;
}

export const createMap = (): WebMap => {
  const leafletMap = L.map("map").setView([50.085448, 14.446865], 13);

  L.tileLayer(
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cHdSuknoOcLSEePavjoJ"
  ).addTo(leafletMap);

  const state: MapState = { points: [], loaded: false };

  const layer = new VectorLayer();
  layer.state = state;
  leafletMap.addLayer(layer);
  return {
    leafletMap,
    addPoints: (coords) => {
      // for (const c of coords) {
      //   L.marker(c).addTo(leafletMap);
      // }
      state.points.push(...coords.map((c) => window.map.leafletMap.project(c)));
      if (!state.loaded) {
        leafletMap.setView(coords.at(-1)!, 16);
      }
      state.loaded = true;
      // layer.redraw();
    },
    setPoints: (coords) => {
      // for (const c of coords.slice(state.points.length)) {
      //   L.marker(c).addTo(leafletMap);
      // }
      // state.points = coords;
      state.points = coords.map((c) => window.map.leafletMap.project(c));
      state.loaded = true;
      // layer.redraw();
    },
  };
};
