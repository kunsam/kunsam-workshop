import { GameGeometry } from "../typings/game_geometry";

export function drawPolygon(
  ctx: CanvasRenderingContext2D,
  polygon: GameGeometry.IVector2[],
  { fillStyle }: { fillStyle: string }
) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
//   console.log(polygon, "polygon");
  ctx.moveTo(polygon[0][0], polygon[0][1]);
  polygon.slice(1).forEach((pt) => {
    ctx.lineTo(pt[0], pt[1]);
  });
  ctx.closePath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fill();
}
