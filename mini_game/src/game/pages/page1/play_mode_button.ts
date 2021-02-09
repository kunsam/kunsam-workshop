import TouchableArea from "../../core/touchable_area";
import { drawPolygon } from "../../draw/polygon";

export class PlayModeButton extends TouchableArea {
  public draw(
    ctx: CanvasRenderingContext2D,
    scaleFactor: number,
    fillColor: string
  ) {
    drawPolygon(ctx, this.polygon.hull, {
      fillStyle: fillColor,
    });
  }
}
