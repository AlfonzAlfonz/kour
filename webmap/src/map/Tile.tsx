import L from "leaflet";
import { FC } from "react";
import {
  DEFAULT_ZOOM,
  FOG_SIZE,
  TEXTURE_GRID_COUNT,
  TILE_SIZE,
} from "../config";
import { usePoints } from "../pointStore";
import { getPointsInBounds } from "../pointStore/tree";
import { getAppState } from "../state";
import { ReactPointLayer } from "./ReactPointLayer";
import { getTileId } from "./utils";

interface Props {
  coords: L.Coords;
  tileSize: L.Point;

  layer: ReactPointLayer;
}

export const Tile: FC<Props> = ({ coords, layer }) => {
  const { tree } = usePoints(getAppState().store);

  const absoluteCoords = {
    x: (coords.x * 2 ** DEFAULT_ZOOM) / TILE_SIZE,
    y: (coords.y * 2 ** DEFAULT_ZOOM) / TILE_SIZE,
  };
  const r = FOG_SIZE * Math.pow(2, coords.z - 13);

  const c = new L.Point(coords.x - 0.2, coords.y - 0.2);
  (c as any).z = coords.z;

  const lls = getPointsInBounds(tree, layer._tileCoordsToBounds(c as any));

  const maskPoint = (ll: L.LatLngTuple, i: number) => {
    const p = getAppState().map.project(ll, coords.z);

    const x = p.x - absoluteCoords.x;
    const y = p.y - absoluteCoords.y;

    return (
      <circle
        key={i}
        cx={x.toFixed(4)}
        cy={y.toFixed(4)}
        r={r.toFixed(4)}
        fill="url(#gradient)"
      />
    );
  };

  return (
    <>
      <defs>
        <mask id={getTileId(coords)}>
          <rect x={0} y={0} width="100%" height="100%" fill="white" />
          {lls.map(maskPoint)}
        </mask>
      </defs>
      <image
        x={0}
        y={0}
        href={`image${(coords.x % TEXTURE_GRID_COUNT) + 1}x${
          (coords.y % TEXTURE_GRID_COUNT) + 1
        }.png`}
        // fill="black"
        width="100%"
        height="100%"
        mask={`url(#${getTileId(coords)})`}
        imageRendering="optimizeSpeed"
      />
    </>
  );
};
