import L from "leaflet";
import { createTileElement } from "./createTileElement";

interface FOWLayerClass {
  new (): L.GridLayer & { state: MapState };
}

export interface MapState {
  points: L.Point[];
  loaded: boolean;
}

export const VectorLayer: FOWLayerClass = L.GridLayer.extend({
  createTile: function (
    this: L.GridLayer,
    coords: { x: number; y: number; z: number }
  ) {
    const id = `tile_${coords.x}_${coords.y}`;
    const { points }: MapState = (this as any).state ?? {};

    return createTileElement(id, points, coords, this.getTileSize());
  },
});