import L from "leaflet";

export type TreeNode =
  | { lls: L.LatLngTuple[] }
  | {
      center: L.LatLngTuple;

      northwest: TreeNode;
      northeast: TreeNode;

      southwest: TreeNode;
      southeast: TreeNode;
    };

export const createTree = (lls: L.LatLngTuple[], depth = 0): TreeNode => {
  if (lls.length < 50) return { lls: lls };

  const [centerLat, centerLng]: [number, number] = [
    lls.map(([lat]) => lat).reduce(sum, 0) / lls.length,
    lls.map(([_, lng]) => lng).reduce(sum, 0) / lls.length,
  ];

  const northwest = [];
  const northeast = [];
  const southwest = [];
  const southeast = [];

  for (const c of lls) {
    const [lat, lng] = c;
    if (lat > centerLat && lng < centerLng) {
      northwest.push(c);
    }
    if (lat > centerLat && lng > centerLng) {
      northeast.push(c);
    }
    if (lat < centerLat && lng < centerLng) {
      southwest.push(c);
    }
    if (lat < centerLat && lng > centerLng) {
      southeast.push(c);
    }
  }

  return {
    center: [centerLat, centerLng],
    northwest: createTree(northwest, depth + 1),
    northeast: createTree(northeast, depth + 1),
    southwest: createTree(southwest, depth + 1),
    southeast: createTree(southeast, depth + 1),
  };
};

export const appendTree = (tree: TreeNode, ll: L.LatLngTuple) => {
  if ("lls" in tree) {
    tree.lls.push(ll);
    return;
  }

  const [centerLat, centerLng]: [number, number] = tree.center;
  const [lat, lng] = ll;
  if (lat > centerLat && lng < centerLng) {
    appendTree(tree.northwest, ll);
  }
  if (lat > centerLat && lng > centerLng) {
    appendTree(tree.northeast, ll);
  }
  if (lat < centerLat && lng < centerLng) {
    appendTree(tree.southwest, ll);
  }
  if (lat < centerLat && lng > centerLng) {
    appendTree(tree.southeast, ll);
  }
};

export const getPointsInBounds = (
  tree: TreeNode,
  bounds: L.LatLngBounds
): L.LatLngTuple[] => {
  if ("lls" in tree) {
    return tree.lls;
  }

  const northwest = bounds.getNorthWest();
  const northeast = bounds.getNorthEast();
  const southwest = bounds.getSouthWest();
  const southeast = bounds.getSouthEast();

  const points: L.LatLngTuple[] = [];
  const [centerLat, centerLng] = tree.center;

  if (northwest.lat > centerLat && northwest.lng < centerLng) {
    points.push(...getPointsInBounds(tree.northwest, bounds));
  }
  if (northeast.lat > centerLat && northeast.lng > centerLng) {
    points.push(...getPointsInBounds(tree.northeast, bounds));
  }
  if (southwest.lat < centerLat && southwest.lng < centerLng) {
    points.push(...getPointsInBounds(tree.southwest, bounds));
  }
  if (southeast.lat < centerLat && southeast.lng > centerLng) {
    points.push(...getPointsInBounds(tree.southeast, bounds));
  }

  return points;
};

const sum = (acc: number, x: number) => acc + x;
