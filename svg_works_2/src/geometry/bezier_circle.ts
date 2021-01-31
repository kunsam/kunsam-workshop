import { Vector2, MathUtils } from "three";
import VectorUtil from "../vector_util";

const B_CONSTANT = 0.551915024494;

// http://digerati-illuminatus.blogspot.com/2008/05/approximating-semicircle-with-cubic.html
export function getSemiCircleWithCubicBezier(
  from: Vector2,
  to: Vector2,
  direction: "Clockwise" | "CounterClockwise"
) {
  const diameter = new Vector2().subVectors(to, from);
  const pdiameter =
    direction === "Clockwise"
      ? VectorUtil.PerpendicularClockwise(diameter)
      : VectorUtil.PerpendicularCounterClockwise(diameter);

  const diameteru = diameter.clone().normalize();
  const pdiameteru = pdiameter.clone().normalize();

  const diameterOffset = diameteru
    .clone()
    .multiplyScalar(diameter.length() * 0.05);
  const pdiameterOffset = pdiameteru
    .clone()
    .multiplyScalar(((diameter.length() / 2) * 4.0) / 3.0);

  const revDiameterOffset = diameterOffset.clone().multiplyScalar(-1);

  const p1 = from.clone().add(diameterOffset).add(pdiameterOffset);

  const p2 = to.clone().add(revDiameterOffset).add(pdiameterOffset);

  return `M ${from.x} ${from.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${to.x} ${to.y}`;
}

export function getCircleWithCubicBezier(
  from: Vector2,
  to: Vector2,
  direction: "Clockwise" | "CounterClockwise"
) {
  const diameter = new Vector2().subVectors(to, from);
  const pdiameter =
    direction === "Clockwise"
      ? VectorUtil.PerpendicularClockwise(diameter)
      : VectorUtil.PerpendicularCounterClockwise(diameter);

  const diameteru = diameter.clone().normalize();
  const pdiameteru = pdiameter.clone().normalize();

  const diameterOffset = diameteru
    .clone()
    .multiplyScalar(diameter.length() * 0.05);
  const pdiameterOffset = pdiameteru
    .clone()
    .multiplyScalar(((diameter.length() / 2) * 4.0) / 3.0);

  const revDiameterOffset = diameterOffset.clone().multiplyScalar(-1);

  const p1 = from.clone().add(diameterOffset).add(pdiameterOffset);
  const p2 = to.clone().add(revDiameterOffset).add(pdiameterOffset);
  const p1_1 = from
    .clone()
    .add(diameterOffset)
    .add(pdiameterOffset.clone().multiplyScalar(-1));
  const p2_2 = to
    .clone()
    .add(revDiameterOffset)
    .add(pdiameterOffset.clone().multiplyScalar(-1));

  return `M ${from.x} ${from.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${to.x} ${to.y} C ${p2_2.x} ${p2_2.y} ${p1_1.x} ${p1_1.y} ${from.x} ${from.y}`;
}

export function getCircleWithCubicBezierWithRadius(
  center: Vector2,
  radius: number
) {
  const circleRight = center.clone().add(new Vector2(radius, 0));
  const circleLeft = center.clone().add(new Vector2(-1 * radius, 0));
  const circleCurve = getCircleWithCubicBezier(
    circleRight,
    circleLeft,
    "CounterClockwise"
  );
  return circleCurve;
}

// 获得四分之一圆弧控制点
function getQuadrantArcsControlPoint(point1: Vector2, point2: Vector2) {}

// 这个要弃用
// https://www.tinaja.com/glib/bezcirc2.pdf
// 极坐标下获取贝塞尔模拟圆绘制路径
export function getBesizerApproCircularArcPath(
  endPointAngleDegree: number,
  raduis: number,
  center: Vector2
) {
  const p0_anlge = MathUtils.degToRad(45);
  const P0_relative_angle = MathUtils.degToRad(endPointAngleDegree) - p0_anlge;
  const toPrecision = (num: number, precision: number) => {
    const base = Math.pow(10, precision);
    return Math.round((num * base) / base);
  };
  const P0 = new Vector2(
    toPrecision(
      center.x + raduis * Math.cos(MathUtils.degToRad(endPointAngleDegree)),
      2
    ),
    toPrecision(
      center.y + raduis * Math.sin(MathUtils.degToRad(endPointAngleDegree)),
      2
    )
  );
  const p0 = new Vector2(Math.cos(p0_anlge), Math.sin(p0_anlge));
  const p1 = new Vector2(
    (4 - p0.x) / 3,
    ((1 - p0.x) * (3 - p0.x)) / (3 * p0.y)
  );
  const p1_anlge = Math.atan(p1.y / p1.x);
  const p1_raduis = raduis * Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
  const P1 = new Vector2(
    toPrecision(
      center.x + p1_raduis * Math.cos(p1_anlge + P0_relative_angle),
      2
    ),
    toPrecision(
      center.y + p1_raduis * Math.sin(p1_anlge + P0_relative_angle),
      2
    )
  );
  const p2_anlge = -1 * p1_anlge;
  const P2 = new Vector2(
    toPrecision(
      center.x + p1_raduis * Math.cos(p2_anlge + P0_relative_angle),
      2
    ),
    toPrecision(
      center.y + p1_raduis * Math.sin(p2_anlge + P0_relative_angle),
      2
    )
  );
  const p3_angle = -1 * p0_anlge;
  const P3 = new Vector2(
    toPrecision(center.x + raduis * Math.cos(p3_angle + P0_relative_angle), 2),
    toPrecision(center.y + raduis * Math.sin(p3_angle + P0_relative_angle), 2)
  );
  return {
    path: `M ${P0.x} ${P0.y} C ${P1.x} ${P1.y} ${P2.x} ${P2.y} ${P3.x} ${P3.y}`,
    points: [P0, P1, P2, P3],
  };
}

export function getBesizerApproCirclePath(raduis: number, center: Vector2) {
  const path = [90, 180, 270, 360]
    .map((angle) => getBesizerApproCircularArcPath(angle, raduis, center).path)
    .join(" ");

  return path;
  //   const points: Vector2[] = [90, 180, 270, 360]
  //     .map(
  //       (angle) => getBesizerApproCircularArcPath(angle, raduis, center).points
  //     )
  //     .reduce((p, c) => [].concat.apply([], [p, c]), []);

  //   return `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y} M${points[4].x} ${points[4].y} S ${points[6].x} ${points[6].y} ${points[7].x} ${points[7].y}`;
}
