export default class MathUtils {
  public static DEG2RAD = Math.PI / 180;
  public static RAD2DEG = 180 / Math.PI;

  public static degToRad(degrees: number) {
    return degrees * MathUtils.DEG2RAD;
  }

  public static radToDeg(radians: number) {
    return radians * MathUtils.RAD2DEG;
  }
}
