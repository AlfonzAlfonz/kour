import L from "leaflet";

interface FOWLayerClass {
  new (points: Props): InstanceType<ReturnType<typeof L.GridLayer.extend>>;
}

interface Props {
  points: L.Point[];
}

const FOGSIZE = 7;

const createSVG = (
  name: string,
  attributes: Record<string, string | number> = {},
  children: Node[] = []
) => {
  var el = document.createElementNS("http://www.w3.org/2000/svg", name);

  for (const [name, value] of Object.entries(attributes)) {
    el.setAttribute(name, String(value));
  }

  for (const child of children) {
    el.append(child);
  }

  return el;
};

export const VectorLayer: FOWLayerClass = L.GridLayer.extend({
  createTile: function (
    this: L.GridLayer,
    coords: { x: number; y: number; z: number }
  ) {
    const id = `tile_${coords.x}_${coords.y}`;
    const { points }: Props = (this as any).state ?? {};

    var tile = createSVG("svg", {}, [
      createSVG("rect", {
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        fill: "rgba(0,0,0,0.9)",
        mask: `url(#${id})`,
      }),
    ]);

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

    if (current.length === 0) return tile;

    var gradient = createSVG("radialGradient", { id: "gradient" }, [
      createSVG("stop", { offset: 0, "stop-color": "black" }),
      createSVG("stop", { offset: 1, "stop-color": "transparent" }),
    ]) as SVGLinearGradientElement;
    tile.append(gradient);

    var mask = createSVG("mask", { id }, [
      createSVG("rect", {
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        fill: "white",
      }),
    ]);
    tile.append(mask);

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
      circle.setAttribute("fill", "url(#gradient)");

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
