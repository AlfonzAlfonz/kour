import "leaflet/dist/leaflet.css";
import points from "./export.json";
import { Receiver } from "./receiver";
import "./style.css";
import { createDefs } from "./svg/createDefs";
import { featureFlags } from "./featureFlags";

declare global {
  interface Window {
    receiver: Receiver;
  }
}

createDefs(document.querySelector("#defs")!);

window.receiver = new Receiver();

if (featureFlags.debugInit) {
  const lls = points.map((p) => [p[1], p[2]] as L.LatLngTuple);
  window.receiver.init(
    lls,
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cHdSuknoOcLSEePavjoJ"
  );
}
