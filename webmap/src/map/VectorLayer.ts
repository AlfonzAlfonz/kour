import L from "leaflet";

interface FOWLayerClass {
  new (points: Props): InstanceType<ReturnType<typeof L.GridLayer.extend>>;
}

interface Props {
  points: L.Point[];
}

const FOGSIZE = 20;

const createSVG = (name: string) =>
  document.createElementNS("http://www.w3.org/2000/svg", name);

export const VectorLayer: FOWLayerClass = L.GridLayer.extend({
  createTile: function (
    this: L.GridLayer,
    coords: { x: number; y: number; z: number }
  ) {
    const id = `tile_${coords.x}_${coords.y}`;
    const { points }: Props = (this as any).state ?? {};

    var tile = createSVG("svg");

    var mask = createSVG("mask");
    mask.id = id;
    tile.append(mask);

    var fog = createSVG("rect") as SVGRectElement;
    fog.setAttribute("x", "0");
    fog.setAttribute("y", "0");
    fog.setAttribute("width", "100%");
    fog.setAttribute("height", "100%");
    fog.setAttribute("fill", "black");
    fog.setAttribute("mask", `url(#${id})`);
    tile.append(fog);

    if (!points) return tile;

    var tileSize = this.getTileSize();
    tile.setAttribute("width", String(tileSize.x));
    tile.setAttribute("height", String(tileSize.y));
    tile.setAttribute("viewbox", `0 0 ${tileSize.x} ${tileSize.y}`);

    const zoomMultiplier = Math.pow(2, coords.z - 13);
    const zoomedSize = tileSize.x / zoomMultiplier;

    // if (!import.meta.env.PROD) {
    //   ctx.strokeStyle = "red";
    //   ctx.strokeRect(0, 0, tileSize.x, tileSize.y);
    // }

    const tileAbsolute = {
      x: coords.x * zoomedSize,
      y: coords.y * zoomedSize,
    };

    const current = points.filter(
      (p) =>
        distanceToTile(p, tileAbsolute.x, tileAbsolute.y, zoomedSize) <
        10 * FOGSIZE * zoomMultiplier
    );

    var fog = createSVG("rect") as SVGRectElement;
    fog.setAttribute("x", "0");
    fog.setAttribute("y", "0");
    fog.setAttribute("width", "100%");
    fog.setAttribute("height", "100%");
    fog.setAttribute("fill", "white");
    mask.append(fog);

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

      const circle = createSVG("circle") as SVGCircleElement;
      circle.setAttribute("cx", x.toFixed(4));
      circle.setAttribute("cy", y.toFixed(4));
      circle.setAttribute("r", r.toFixed(4));
      circle.setAttribute("fill", "black");

      mask.append(circle);
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
