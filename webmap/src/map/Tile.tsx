import L from "leaflet";
import { FC, useSyncExternalStore } from "react";
import { PointStore } from "./pointsStore";
import { getTileId } from "./utils";
import { DEFAULT_ZOOM, FOG_SIZE, TILE_SIZE } from "../config";

interface Props {
  coords: L.Coords;
  tileSize: L.Point;

  store: PointStore;
  map: L.Map;
}

export const Tile: FC<Props> = ({ coords, tileSize, store }) => {
  const points = usePoints(store);

  const zoomMultiplier = Math.pow(2, coords.z - 13);

  const absoluteCoords = {
    x: (coords.x * 2 ** DEFAULT_ZOOM) / tileSize.x,
    y: (coords.y * 2 ** DEFAULT_ZOOM) / tileSize.y,
  };

  const maskPoint = (tuple: L.LatLngTuple, i: number) => {
    const p = window.map.leafletMap.project(tuple, coords.z);

    const x = p.x - absoluteCoords.x;
    const y = p.y - absoluteCoords.y;
    const r = FOG_SIZE * zoomMultiplier;

    if (x < -r || x > tileSize.x + r || y < -r || y > tileSize.y + r)
      return null;

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
        {/* <mask id={`${getTileId(coords)}_patternmask`}>
          <image
            x={0}
            y={0}
            href={`/image${(coords.x % 4) + 1}x${(coords.y % 4) + 1}.png`}
            width="100%"
            height="100%"
            style={{ filter: "invert()" }}
          ></image>
        </mask> */}
        <pattern
          id={getTileId(coords) + "_pattern"}
          x={0}
          y={0}
          patternUnits="userSpaceOnUse"
          height={TILE_SIZE}
          width={TILE_SIZE}
        >
          <image
            x={0}
            y={0}
            href={`/image${(coords.x % 4) + 1}x${(coords.y % 4) + 1}.png`}
            width="100%"
            height="100%"
            // mask={`url(#${getTileId(coords)}_patternmask)`}
          ></image>
        </pattern>
        <mask id={getTileId(coords)}>
          <rect x={0} y={0} width="100%" height="100%" fill="white" />
          {points.map(maskPoint)}
        </mask>
      </defs>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        fill={`url(#${getTileId(coords)}_pattern)`}
        mask={`url(#${getTileId(coords)})`}
      />
    </>
  );
};

const usePoints = (store: PointStore) =>
  useSyncExternalStore(
    (listener) => store.subscribe(listener),
    store.getSnapshot
  );
