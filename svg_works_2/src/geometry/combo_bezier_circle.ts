import { Vector2 } from "three";
import { getBesizerApproCircularArcPath } from "./bezier_circle";

export function getDoubleBesizerCircleGroup(
  circle1: { center: Vector2; radius: number },
  circle2: { center: Vector2; radius: number }
) {
  const cicle1Points = [90, 180, 270, 360].map(
    (deg) =>
      getBesizerApproCircularArcPath(deg, circle1.radius, circle1.center).points
  );
  const cicle2Points = [90, 180, 270, 360].map(
    (deg) =>
      getBesizerApproCircularArcPath(deg, circle2.radius, circle2.center).points
  );

  let pathStr = "";
  const group90pts = cicle1Points[1];
  pathStr += `M ${group90pts[3].x} ${group90pts[3].y} C ${group90pts[2].x} ${group90pts[2].y} ${group90pts[1].x} ${group90pts[1].y} ${group90pts[0].x} ${group90pts[0].y}`;

  const array = [cicle1Points[0]];
  array.forEach((degpts) => {
    pathStr += `S ${degpts[2].x} ${degpts[2].y} ${degpts[3].x} ${degpts[3].y}`;
  });

  cicle2Points.forEach((degpts) => {
    pathStr += `S ${degpts[2].x} ${degpts[2].y} ${degpts[3].x} ${degpts[3].y}`;
  });

  const array2 = [cicle1Points[3], cicle1Points[2]];
  array2.forEach((degpts) => {
    pathStr += `S ${degpts[1].x} ${degpts[1].y} ${degpts[0].x} ${degpts[0].y}`;
  });

  pathStr += "z";

  return pathStr;
}
