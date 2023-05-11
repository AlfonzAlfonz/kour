import L from "leaflet";
import { PointStore } from "./pointsStore";
import { FC, useSyncExternalStore } from "react";
import { DEFAULT_ZOOM, FOG_SIZE } from ".";
import { getTileId } from "./utils";

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

  const maskPoint = (tuple: L.LatLngTuple) => {
    const p = window.map.leafletMap.project(tuple, coords.z);

    const x = p.x - absoluteCoords.x;
    const y = p.y - absoluteCoords.y;
    const r = FOG_SIZE * zoomMultiplier;

    if (x < -r || x > tileSize.x + r || y < -r || y > tileSize.y + r)
      return null;

    return (
      <circle
        cx={x.toFixed(4)}
        cy={y.toFixed(4)}
        r={r.toFixed(4)}
        fill="url(#gradient)"
      />
    );
  };

  return (
    <>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0.9)"
        mask={`url(#${getTileId(coords)})`}
      />
      <mask id={getTileId(coords)}>
        <rect x={0} y={0} width="100%" height="100%" fill="white" />
        {points.map(maskPoint)}
      </mask>
    </>
  );
};

const usePoints = (store: PointStore) =>
  useSyncExternalStore(
    (listener) => store.subscribe(listener),
    store.getSnapshot
  );
