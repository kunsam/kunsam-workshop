import { MathUtils, Vector2 } from "three";

export default class StandardGeometryBezierCircle {
  public static getBesizerApproCirclePath({
    center,
    raduis,
    startPointTheta,
    needMove,
  }: {
    startPointTheta: number;
    raduis: number;
    center: Vector2;
    needMove?: boolean;
  }) {
    let pathStr = "";

    const resultPoints = new Array(4)
      .fill(null)
      .map((_, i) => ({
        center,
        raduis,
        startPointTheta: startPointTheta + i * 90,
        endPointTheta: startPointTheta + i * 90 + 90,
      }))
      .map((data) => this.getBesizerApproCircularArcPath(data))
      .map((r) => r.points);

    const pt1 = resultPoints[0];
    if (needMove) {
      pathStr += `M ${pt1.startPoint.x},${pt1.startPoint.y}`;
    }
    pathStr += `C ${pt1.firstControlPoint.x},${pt1.firstControlPoint.y} ${pt1.secondControlPoint.x},${pt1.secondControlPoint.y} ${pt1.endPoint.x},${pt1.endPoint.y}`;

    [resultPoints[1], resultPoints[2], resultPoints[3]].forEach((pts) => {
      pathStr += `S ${pts.secondControlPoint.x},${pts.secondControlPoint.y} ${pts.endPoint.x},${pts.endPoint.y}`;
    });
    return pathStr;
  }
  /**
   *  https://www.tinaja.com/glib/bezcirc2.pdf
   * 极坐标下获取贝塞尔模拟圆绘制路径
   *
   * @static
   * @memberof StandardGeometryBezierCircle
   */
  public static getBesizerApproCircularArcPath({
    center,
    raduis,
    endPointTheta,
    startPointTheta,
  }: {
    startPointTheta: number;
    endPointTheta: number;
    raduis: number;
    center: Vector2;
  }) {
    const toPrecision = (num: number, precision: number) => {
      const base = Math.pow(10, precision);
      return Math.round((num * base) / base);
    };

    const startPoint = new Vector2(
      toPrecision(
        center.x + raduis * Math.cos(MathUtils.degToRad(startPointTheta)),
        2
      ),
      toPrecision(
        center.y + raduis * Math.sin(MathUtils.degToRad(startPointTheta)),
        2
      )
    );
    const endPoint = new Vector2(
      toPrecision(
        center.x + raduis * Math.cos(MathUtils.degToRad(endPointTheta)),
        2
      ),
      toPrecision(
        center.y + raduis * Math.sin(MathUtils.degToRad(endPointTheta)),
        2
      )
    );
    const p0_anlge = MathUtils.degToRad((endPointTheta - startPointTheta) / 2);
    const p0_relative_angle = MathUtils.degToRad(endPointTheta) - p0_anlge;
    const p0 = new Vector2(Math.cos(p0_anlge), Math.sin(p0_anlge));
    const p1 = new Vector2(
      (4 - p0.x) / 3,
      ((1 - p0.x) * (3 - p0.x)) / (3 * p0.y)
    );
    const controlPointRadius =
      raduis * Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
    const p1_anlge = Math.atan(p1.y / p1.x);
    const secondControlPoint = new Vector2(
      toPrecision(
        center.x + controlPointRadius * Math.cos(p1_anlge + p0_relative_angle),
        2
      ),
      toPrecision(
        center.y + controlPointRadius * Math.sin(p1_anlge + p0_relative_angle),
        2
      )
    );
    const p2_anlge = -1 * p1_anlge;
    const firstControlPoint = new Vector2(
      toPrecision(
        center.x + controlPointRadius * Math.cos(p2_anlge + p0_relative_angle),
        2
      ),
      toPrecision(
        center.y + controlPointRadius * Math.sin(p2_anlge + p0_relative_angle),
        2
      )
    );

    return {
      path: `M ${startPoint.x} ${startPoint.y} C ${firstControlPoint.x} ${firstControlPoint.y} ${secondControlPoint.x} ${secondControlPoint.y} ${endPoint.x} ${endPoint.y}`,
      points: {
        startPoint,
        endPoint,
        firstControlPoint,
        secondControlPoint,
      },
    };
  }
}
