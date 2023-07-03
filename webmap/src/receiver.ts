import { getAppState, initState } from "./state";

export class Receiver {
  constructor() {}

  init(initialLls: L.LatLngTuple[], initialMapType: string) {
    initState(initialLls, initialMapType);
  }

  update(lls: L.LatLngTuple[]) {
    const state = getAppState();
    state.store.addPoints(lls);

    if (lls.length) {
      state.marker.setLatLng(lls.at(-1)!);
    }
  }

  changeMapType(type: string) {
    getAppState().tileLayer.setUrl(type);
  }
}
