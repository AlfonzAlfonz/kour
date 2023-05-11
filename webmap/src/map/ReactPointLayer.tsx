import L, { Coords } from "leaflet";
import { createRoot } from "react-dom/client";
import { PointStore } from "./pointsStore";
import { createSVG } from "./utils";
import { Tile } from "./Tile";

interface ReactPointLayer {
  new (): L.GridLayer & {
    store: PointStore;
    map: L.Map;
  };
}

export const ReactLayer: ReactPointLayer = L.GridLayer.extend({
  createTile: function (this: InstanceType<ReactPointLayer>, coords: Coords) {
    const tileSize = this.getTileSize();
    const tile = createSVG("svg", {
      width: tileSize.x,
      height: tileSize.y,
      viewbox: `0 0 ${tileSize.x} ${tileSize.y}`,
    });

    createRoot(tile).render(
      <Tile
        coords={coords}
        tileSize={tileSize}
        store={this.store}
        map={this.map}
      />
    );

    return tile;
  },
});
