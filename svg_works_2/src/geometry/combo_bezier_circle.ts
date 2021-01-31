import { Vector2 } from "three";
import { getBesizerApproCircularArcPath } from "./bezier_circle";
import StandardGeometryBezierCircle from "./standard/bezier_circle";

export function getTwotangentialCirclesPath(
  circleSmall: { center: Vector2; radius: number },
  circle2Big: { center: Vector2; radius: number },
  thetaOfPointOfTangency: number
) {
  let pathStr = "";
  const circle2BigArc1 = StandardGeometryBezierCircle.getBesizerApproCircularArcPath(
    {
      startPointTheta: thetaOfPointOfTangency + 90,
      endPointTheta: thetaOfPointOfTangency + 180,
      raduis: circle2Big.radius,
      center: circle2Big.center,
    }
  );
  pathStr += `M ${circle2BigArc1.points.endPoint.x},${circle2BigArc1.points.endPoint.y}`;
  const ctlpt1 = circle2BigArc1.points.firstControlPoint;
  const ctlpt2 = circle2BigArc1.points.secondControlPoint;
  pathStr += ` C ${ctlpt2.x},${ctlpt2.y} ${ctlpt1.x},${ctlpt1.y} ${circle2BigArc1.points.startPoint.x},${circle2BigArc1.points.startPoint.y}`;
  const circle2BigArc2 = StandardGeometryBezierCircle.getBesizerApproCircularArcPath(
    {
      startPointTheta: thetaOfPointOfTangency,
      endPointTheta: thetaOfPointOfTangency + 90,
      raduis: circle2Big.radius,
      center: circle2Big.center,
    }
  );
  pathStr += `S ${circle2BigArc2.points.firstControlPoint.x},${circle2BigArc2.points.firstControlPoint.y} ${circle2BigArc2.points.startPoint.x},${circle2BigArc2.points.startPoint.y}`;
  const smallCirclePath = StandardGeometryBezierCircle.getBesizerApproCirclePath(
    {
      center: circleSmall.center,
      raduis: circleSmall.radius,
      startPointTheta: thetaOfPointOfTangency,
    }
  );
  console.log(smallCirclePath, "smallCirclePath");
  pathStr += smallCirclePath;
  const circle2BigArc3 = StandardGeometryBezierCircle.getBesizerApproCircularArcPath(
    {
      startPointTheta: thetaOfPointOfTangency + 270,
      endPointTheta: thetaOfPointOfTangency + 360,
      raduis: circle2Big.radius,
      center: circle2Big.center,
    }
  );
  const circle2BigArc3ctlpt1 = circle2BigArc3.points.firstControlPoint;
  const circle2BigArc3ctlpt2 = circle2BigArc3.points.secondControlPoint;
  pathStr += `C ${circle2BigArc3ctlpt2.x},${circle2BigArc3ctlpt2.y} ${circle2BigArc3ctlpt1.x},${circle2BigArc3ctlpt1.y}`;
  pathStr += ` ${circle2BigArc3.points.startPoint.x},${circle2BigArc3.points.startPoint.y}`;
  const circle2BigArc4 = StandardGeometryBezierCircle.getBesizerApproCircularArcPath(
    {
      startPointTheta: thetaOfPointOfTangency + 180,
      endPointTheta: thetaOfPointOfTangency + 270,
      raduis: circle2Big.radius,
      center: circle2Big.center,
    }
  );
  const circle2BigArc4ctlpt1 = circle2BigArc4.points.firstControlPoint;
  pathStr += `S ${circle2BigArc4ctlpt1.x},${circle2BigArc4ctlpt1.y}`;
  pathStr += ` ${circle2BigArc4.points.startPoint.x},${circle2BigArc4.points.startPoint.y}`;

  pathStr += "z";
  return pathStr;
}

/**
 * 默认采用大圆逆时针🔄旋转方案
 * 获取相切两圆闭合图形
 * @export
 * @param {{ center: Vector2; radius: number }} circleSmall
 * @param {{ center: Vector2; radius: number }} circle2Big
 * @param {*} ThetaOfPointOfTangency
 * @return {*}
 */
export function getDoubleBesizerCircleGroup(
  circleSmall: { center: Vector2; radius: number },
  circle2Big: { center: Vector2; radius: number },
  ThetaOfPointOfTangency: number
) {
  const cicle1Points = [90, 180, 270, 360].map(
    (deg) =>
      getBesizerApproCircularArcPath(
        deg,
        circleSmall.radius,
        circleSmall.center
      ).points
  );
  const cicle2Points = [90, 180, 270, 360].map(
    (deg) =>
      getBesizerApproCircularArcPath(deg, circle2Big.radius, circle2Big.center)
        .points
  );
  console.log(cicle1Points, cicle2Points, "cicle2Points");
  let pathStr = "M";
  const array0 = [cicle2Points[1]];
  array0.forEach((degpts) => {
    pathStr += `${degpts[0].x},${degpts[0].y} C ${degpts[1].x},${degpts[1].y} ${degpts[2].x},${degpts[2].y} ${degpts[3].x},${degpts[3].y}`;
  });
  const array = [cicle2Points[0]];
  array.forEach((degpts) => {
    pathStr += `S ${degpts[2].x},${degpts[2].y} ${degpts[3].x},${degpts[3].y}`;
  });
  // [cicle1Points[0], cicle1Points[1], cicle1Points[2], cicle1Points[3]].forEach(
  //   (degpts, di) => {
  //     if (di === 0) {
  //       pathStr += `C ${degpts[2].x},${degpts[2].y} ${degpts[1].x},${degpts[1].y} ${degpts[0].x},${degpts[0].y}`;
  //     } else {
  //       pathStr += `S ${degpts[1].x},${degpts[1].y} ${degpts[0].x},${degpts[0].y}`;
  //     }
  //   }
  // );
  // [cicle2Points[3], cicle2Points[2]].forEach((degpts, di) => {
  //   if (di === 0) {
  //     pathStr += `C ${degpts[1].x},${degpts[1].y} ${degpts[2].x},${degpts[2].y} ${degpts[3].x},${degpts[3].y}`;
  //   } else {
  //     pathStr += `S ${degpts[2].x},${degpts[2].y} ${degpts[3].x},${degpts[3].y}`;
  //   }
  // });
  // pathStr += `z`;

  return pathStr;
}
