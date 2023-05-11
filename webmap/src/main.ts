import "leaflet/dist/leaflet.css";
import { createMap, WebMap } from "./map";
// import { points } from "./points";
import points from "./export.json";
import "./style.css";
import { createLines } from "./createLines";
import L from "leaflet";

declare global {
  interface Window {
    map: WebMap;
  }
}

window.map = createMap();

// window.map.addPoints(points.map((x) => [x[1], x[2]]));

if (false && import.meta.env.MODE === "dev") {
  console.log("AAAA");
  const map = window.map.leafletMap;

  const lines = createLines(
    map,
    points.map((p) => [p[2], p[1]] as L.LatLngTuple)
  );
  console.log(lines);

  const geoJson = lines.map((l) => ({
    coordinates: l,
    type: "LineString" as const,
  }));

  L.geoJson(geoJson, {
    style: {
      color: "red",
      weight: 5,
      opacity: 1,
    },
  }).addTo(map);

  // L.geoJSON(
  //   points.map(
  //     (p) => ({
  //       type: "Feature",
  //       properties: {},
  //       geometry: {
  //         coordinates: p,
  //         type: "Point" as const,
  //       },
  //     }),
  //     {
  //       style: {
  //         color: "blue",
  //         weight: 5,
  //         opacity: 1,
  //       },
  //     }
  //   )
  // ).addTo(map);

  // window.map.setPoints(
  //   points.map(([_, lat, lon]) => [+lat, +lon] as L.LatLngTuple)
  // );
}
