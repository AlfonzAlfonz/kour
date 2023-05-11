import { Coords } from "leaflet";

export const createSVG = <T extends keyof SVGElementTagNameMap>(
  name: T,
  attributes: Record<string, string | number> = {},
  children: Node[] = []
): SVGElementTagNameMap[T] => {
  var el = document.createElementNS("http://www.w3.org/2000/svg", name);

  for (const [name, value] of Object.entries(attributes)) {
    el.setAttribute(name, String(value));
  }

  for (const child of children) {
    el.append(child);
  }

  return el;
};

export const getTileId = (c: Coords) => `tile-${c.x}-${c.y}-${c.z}`;
