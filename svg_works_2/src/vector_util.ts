import { Vector2 } from "three";

// comment
export default class VectorUtil {
  public static PerpendicularClockwise(vector2: Vector2) {
    return new Vector2(vector2.y, -vector2.x);
  }
  
  public static PerpendicularCounterClockwise(vector2: Vector2) {
    return new Vector2(-vector2.y, vector2.x);
  }
}
