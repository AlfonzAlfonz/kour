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
  let index = 0;

  window.map.store.addPoints(points.map((p) => [p[1], p[2]]));

  // setInterval(() => {
  //   const [_, lat, lon] = points[index];

  //   window.map.store.addPoints([[+lat, +lon]]);
  //   index++;
  // }, 100);
}
