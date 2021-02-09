import Vector2 from "./vector2";

function intPtOnSegment(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  p: number
) {
  return (
    fix(Math.min(x1, x2), p) <= fix(x, p) &&
    fix(x, p) <= fix(Math.max(x1, x2), p) &&
    fix(Math.min(y1, y2), p) <= fix(y, p) &&
    fix(y, p) <= fix(Math.max(y1, y2), p)
  );
}

// fix to the precision
function fix(n: number, p: number) {
  return Math.floor(n * Math.pow(10, p)) / Math.pow(10, p);
}

export default class LineSegment {
  public startPoint: Vector2;
  public endPoint: Vector2;
  constructor(startPoint: Vector2, endPoint: Vector2) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  public length() {
    return new Vector2().subVectors(this.endPoint, this.startPoint).length();
  }

  public middlePoint() {
    const dir = this.vector2().normalize();
    const middlePoint = this.startPoint
      .clone()
      .add(dir.multiplyScalar(this.length() / 2));
    return middlePoint
  }
  public vector2() {
    return new Vector2().subVectors(this.endPoint, this.startPoint);
  }

  public intersectLineSegment(
    lineSegment: LineSegment,
    precision?: number
  ): Vector2 | undefined {
    const seg1 = [
      [this.startPoint.x, this.startPoint.y],
      [this.endPoint.x, this.endPoint.y],
    ];
    const seg2 = [
      [lineSegment.startPoint.x, lineSegment.startPoint.y],
      [lineSegment.endPoint.x, lineSegment.endPoint.y],
    ];

    var x1 = seg1[0][0],
      y1 = seg1[0][1],
      x2 = seg1[1][0],
      y2 = seg1[1][1],
      x3 = seg2[0][0],
      y3 = seg2[0][1],
      x4 = seg2[1][0],
      y4 = seg2[1][1],
      x,
      y,
      result = false,
      p = precision || 6,
      denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator == 0) {
      // check both segments are Coincident, we already know
      // that these two are parallel
      if (fix((y3 - y1) * (x2 - x1), p) == fix((y2 - y1) * (x3 - x1), p)) {
        // second segment any end point lies on first segment
        if (intPtOnSegment(x3, y3, x1, y1, x2, y2, p)) {
          return new Vector2(x3, y3);
        }
        if (intPtOnSegment(x4, y4, x1, y1, x2, y2, p)) {
          return new Vector2(x4, y4);
        }
      }
    } else {
      x =
        ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
        denominator;
      y =
        ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
        denominator;
      // check int point (x,y) lies on both segment
      result =
        intPtOnSegment(x, y, x1, y1, x2, y2, p) &&
        intPtOnSegment(x, y, x3, y3, x4, y4, p);
      if (result) {
        return new Vector2(x, y);
      }
    }
  }
}
