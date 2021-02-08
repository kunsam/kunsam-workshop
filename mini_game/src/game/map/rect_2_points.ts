import { GameGeometry } from "../typings/game_geometry";

export function getPointsFromRect(
  x: number,
  y: number,
  width: number,
  height: number
): GameGeometry.IVector2[] {
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}
