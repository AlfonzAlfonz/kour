import L, { Coords } from "leaflet";
import { Root, createRoot } from "react-dom/client";
import { PointStore } from "./pointsStore";
import { createSVG } from "./utils";
import { Tile } from "./Tile";

interface ReactPointLayer {
  new (): L.GridLayer & {
    roots: WeakMap<Element, Root>;
    store: PointStore;
    map: L.Map;
  };
}

export const ReactLayer: ReactPointLayer = L.GridLayer.extend({
  onAdd: function (this: InstanceType<ReactPointLayer>, map: L.Map) {
    L.GridLayer.prototype.onAdd.call(this, map);

    this.on("tileunload", (e) => {
      const root = this.roots.get(e.tile);
      root?.unmount();
    });
  },
  roots: new WeakMap<Element, Root>(),
  createTile: function (this: InstanceType<ReactPointLayer>, coords: Coords) {
    const tileSize = this.getTileSize();
    const tile = createSVG("svg", {
      width: tileSize.x,
      height: tileSize.y,
      viewbox: `0 0 ${tileSize.x} ${tileSize.y}`,
    });

    const root = createRoot(tile);
    root.render(
      <Tile
        coords={coords}
        tileSize={tileSize}
        store={this.store}
        map={this.map}
      />
    );
    this.roots.set(tile, root);

    return tile;
  },
});
