export const createLines = (map: L.Map, coords: L.LatLngTuple[]) => {
  const lines: L.LatLngTuple[][] = [];
  let prev: L.LatLngTuple | null = null;

  for (const here of coords) {
    if (prev && here[0] === prev[0] && here[1] === prev[1]) continue;

    if (prev && map.distance(prev, here) < 1500) {
      lines.at(-1)?.push(here);
    } else {
      lines.push([here]);
    }
    prev = here;
  }

  return lines;
};
