import L from "leaflet";
import { VectorLayer } from "./VectorLayer";

interface MapState {
  points: L.Point[];
}

export interface WebMap {
  leafletMap: L.Map;
  addPoints: (coords: L.LatLngTuple[]) => void;
  setPoints: (coords: L.LatLngTuple[]) => void;
}

export const createMap = (): WebMap => {
  const leafletMap = L.map("map").setView([50.085448, 14.446865], 13);

  L.tileLayer(
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cHdSuknoOcLSEePavjoJ",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(leafletMap);

  const state: MapState = { points: [] };

  const layer = new VectorLayer(state);
  layer.state = state;
  leafletMap.addLayer(layer);
  return {
    leafletMap,
    addPoints: (coords) => {
      // for (const c of coords) {
      //   L.marker(c).addTo(leafletMap);
      // }
      state.points.push(...coords.map((c) => window.map.leafletMap.project(c)));
      // layer.redraw();
    },
    setPoints: (coords) => {
      // for (const c of coords.slice(state.points.length)) {
      //   L.marker(c).addTo(leafletMap);
      // }
      // state.points = coords;
      state.points = coords.map((c) => window.map.leafletMap.project(c));
      // layer.redraw();
    },
  };
};
