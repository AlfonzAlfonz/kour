import "leaflet/dist/leaflet.css";
import { createMap, WebMap } from "./map";
import points from "./export.json";
import "./style.css";

declare global {
  interface Window {
    map: WebMap;
  }
}

window.map = createMap();

if (import.meta.env.MODE === "debug") {
  const coords = points.map((p) => [p[1], p[2]] as L.LatLngTuple);
  window.map.store.addPoints(coords);
  window.map.updatePosition(coords.at(-1)!);

  // setInterval(() => {
  //   const [_, lat, lon] = points[index];

  //   window.map.store.addPoints([[+lat, +lon]]);
  //   index++;
  // }, 100);
}
