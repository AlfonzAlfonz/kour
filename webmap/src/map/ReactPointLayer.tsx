import L from "leaflet";
import { Root, createRoot } from "react-dom/client";
import { getAppState } from "../state";
import { Tile } from "./Tile";
import { createSVG } from "./utils";

interface ReactPointLayerClass {
  new (): ReactPointLayer;
}

export interface ReactPointLayer extends L.GridLayer {
  roots: WeakMap<Element, Root>;

  _tileCoordsToBounds(coords: L.Coords): L.LatLngBounds;
  _tileCoordsToNwSe(coords: L.Coords): [L.LatLngTuple, L.LatLngTuple];
}

export const ReactLayer: ReactPointLayerClass = L.GridLayer.extend({
  onAdd: function (this: ReactPointLayer, map: L.Map) {
    L.GridLayer.prototype.onAdd.call(this, map);

    this.on("tileunload", (e) => {
      const root = this.roots.get(e.tile);
      root?.unmount();
    });
  },
  roots: new WeakMap<Element, Root>(),
  createTile: function (this: ReactPointLayer, coords: L.Coords) {
    const tileSize = this.getTileSize();
    const tile = createSVG("svg", {
      width: tileSize.x,
      height: tileSize.y,
      viewbox: `0 0 ${tileSize.x} ${tileSize.y}`,
    });

    const root = createRoot(tile);
    root.render(<Tile coords={coords} tileSize={tileSize} layer={this} />);
    this.roots.set(tile, root);

    return tile;
  },
  _tileCoordsToBounds: function (this: ReactPointLayer, coords: L.Coords) {
    const { map } = getAppState();

    const [nw, se] = this._tileCoordsToNwSe(coords);
    let bounds = new L.LatLngBounds(nw, se);

    if ("noWrap" in this.options && !this.options.noWrap) {
      bounds = map.wrapLatLngBounds(bounds);
    }
    return bounds;
  },
  _tileCoordsToNwSe: function (this: ReactPointLayer, coords: L.Coords) {
    const { map } = getAppState();
    const tileSize = this.getTileSize();
    const nwPoint = coords.scaleBy(tileSize);
    const sePoint = nwPoint.add(tileSize.multiplyBy(1.4));
    const nw = map.unproject(nwPoint, coords.z);
    const se = map.unproject(sePoint, coords.z);

    return [nw, se];
  },
});
