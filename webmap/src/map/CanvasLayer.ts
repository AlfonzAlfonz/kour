import L from "leaflet";

interface FOWLayerClass {
  new (points: Props): InstanceType<ReturnType<typeof L.GridLayer.extend>>;
}

interface Props {
  points: L.Point[];
}

const FOGSIZE = 20;

export const CanvasLayer: FOWLayerClass = L.GridLayer.extend({
  createTile: function (
    this: L.GridLayer,
    coords: { x: number; y: number; z: number }
  ) {
    const { points }: Props = (this as any).state ?? {};

    var tile = document.createElement("canvas");

    if (!points) return tile;

    var tileSize = this.getTileSize();
    tile.setAttribute("width", String(tileSize.x));
    tile.setAttribute("height", String(tileSize.y));

    var ctx = tile.getContext("2d")!;

    const zoomMultiplier = Math.pow(2, coords.z - 13);
    const zoomedSize = tileSize.x / zoomMultiplier;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, tileSize.x, tileSize.y);

    // if (!import.meta.env.PROD) {
    //   ctx.strokeStyle = "red";
    //   ctx.strokeRect(0, 0, tileSize.x, tileSize.y);
    // }

    ctx.globalCompositeOperation = "destination-out";

    const tileAbsolute = {
      x: coords.x * zoomedSize,
      y: coords.y * zoomedSize,
    };

    const current = points.filter(
      (p) =>
        distanceToTile(p, tileAbsolute.x, tileAbsolute.y, zoomedSize) <
        10 * FOGSIZE * zoomMultiplier
    );

    if (current.length === 0) return tile;

    for (const p of current) {
      const x =
        (p.x / tileSize.x - coords.x / zoomMultiplier) *
        tileSize.x *
        zoomMultiplier;
      const y =
        (p.y / tileSize.y - coords.y / zoomMultiplier) *
        tileSize.y *
        zoomMultiplier;
      const r = FOGSIZE * zoomMultiplier;

      ctx.globalCompositeOperation = "destination-out";
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = "";
      ctx.fill();
    }

    return tile;
  },
});

export const distanceToTile = (
  point: L.Point,
  tileX: number,
  tileY: number,
  size: number
) => {
  const dx = Math.max(Math.abs(point.x - (tileX + size / 2)) - size / 2, 0);
  const dy = Math.max(Math.abs(point.y - (tileY + size / 2)) - size / 2, 0);
  return dx * dx + dy * dy;
};
