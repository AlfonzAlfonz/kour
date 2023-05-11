import L from "leaflet";
import { FOWLayer } from "./FOWLayer";

interface MapState {
  points: L.Point[];
}

export interface WebMap {
  leafletMap: L.Map;
  addPoints: (coords: L.LatLngTuple[]) => void;
  setPoints: (coords: L.LatLngTuple[]) => void;
}

export const createMap = (): WebMap => {
  const leafletMap = L.map("map").setView(
    [34.068737, -118.236494],
    13
  );

  L.tileLayer("https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cHdSuknoOcLSEePavjoJ", {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(leafletMap);

  const state: MapState = { points: [] };

  const layer = new FOWLayer(state);
  layer.state = state;
  leafletMap.addLayer(layer);
  return {
    leafletMap,
    addPoints: (coords) => {
      // for (const c of coords) {
      //   L.marker(c).addTo(leafletMap);
      // }
      state.points.push(...coords.map((c) => window.map.leafletMap.project(c)));
      layer.redraw();
    },
    setPoints: (coords) => {
      // for (const c of coords.slice(state.points.length)) {
      //   L.marker(c).addTo(leafletMap);
      // }
      // state.points = coords;
      state.points = coords.map((c) => window.map.leafletMap.project(c));
      layer.redraw();
    },
  };
};
