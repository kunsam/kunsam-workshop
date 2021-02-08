import { GameGeometry } from "../typings/game_geometry";

type IVector2 = GameGeometry.IVector2;

function cross(a: IVector2, b: IVector2, c: IVector2) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function lexicographicOrder(a: IVector2, b: IVector2) {
  return a[0] - b[0] || a[1] - b[1];
}
function computeUpperHullIndexes(points: IVector2[]) {
  const n = points.length,
    indexes = [0, 1];
  let size = 2,
    i;

  for (i = 2; i < n; ++i) {
    while (
      size > 1 &&
      cross(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <=
        0
    )
      --size;
    indexes[size++] = i;
  }

  return indexes.slice(0, size); // remove popped points
}

function getHull(vectors: IVector2[]) {
  if ((n = vectors.length) < 3) return null;

  var i,
    n,
    sortedPoints = new Array(n),
    flippedPoints = new Array(n);

  for (i = 0; i < n; ++i) sortedPoints[i] = [+vectors[i][0], +vectors[i][1], i];
  sortedPoints.sort(lexicographicOrder);
  for (i = 0; i < n; ++i)
    flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

  var upperIndexes = computeUpperHullIndexes(sortedPoints),
    lowerIndexes = computeUpperHullIndexes(flippedPoints);

  // Construct the hull polygon, removing possible duplicate endpoints.
  var skipLeft = lowerIndexes[0] === upperIndexes[0] ? 1 : 0,
    skipRight =
      lowerIndexes[lowerIndexes.length - 1] ===
      upperIndexes[upperIndexes.length - 1]
        ? 1
        : 0,
    hull = [];

  // Add upper hull in right-to-l order.
  // Then add lower hull in left-to-right order.
  for (i = upperIndexes.length - 1; i >= 0; --i)
    hull.push(vectors[sortedPoints[upperIndexes[i]][2]]);
  for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i)
    hull.push(vectors[sortedPoints[lowerIndexes[i]][2]]);

  return hull;
}

export default class Polygon {
  public hull: IVector2[] = [];

  constructor(vectors: IVector2[]) {
    this.hull = getHull(vectors);
  }

  public containPoint(point: IVector2) {
    const polygon = this.hull;
    var n = polygon.length,
      p = polygon[n - 1],
      x = point[0],
      y = point[1],
      x0 = p[0],
      y0 = p[1],
      x1,
      y1,
      inside = false;

    for (var i = 0; i < n; ++i) {
      (p = polygon[i]), (x1 = p[0]), (y1 = p[1]);
      if (y1 > y !== y0 > y && x < ((x0 - x1) * (y - y1)) / (y0 - y1) + x1)
        inside = !inside;
      (x0 = x1), (y0 = y1);
    }

    return inside;
  }

  public centroid() {
    const polygon = this.hull;
    var i = -1,
      n = polygon.length,
      x = 0,
      y = 0,
      a,
      b = polygon[n - 1],
      c,
      k = 0;

    while (++i < n) {
      a = b;
      b = polygon[i];
      k += c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }

    return (k *= 3), [x / k, y / k];
  }
}
