import Vector2 from "../core/vector2";

export default class PointMass {
  public cur: Vector2;
  public prev: Vector2;
  public mass: number;
  public force: Vector2;
  public result: Vector2;
  public friction: number;
  constructor(cx: number, cy: number, mass: number) {
    this.cur = new Vector2(cx, cy);
    this.prev = new Vector2(cx, cy);
    this.mass = mass;
    this.force = new Vector2(0.0, 0.0);
    this.result = new Vector2(0.0, 0.0);
    this.friction = 0.01;
  }

  public move(dt: number) {
    var t, a, c, dtdt;

    dtdt = dt * dt;

    a = this.force.x / this.mass;
    c = this.cur.x;
    t =
      (2.0 - this.friction) * c -
      (1.0 - this.friction) * this.prev.x +
      a * dtdt;
    this.prev.setX(c);
    this.cur.setX(t);

    a = this.force.y / this.mass;
    c = this.cur.y;
    t =
      (2.0 - this.friction) * c -
      (1.0 - this.friction) * this.prev.y +
      a * dtdt;
    this.prev.setY(c);
    this.cur.setY(t);
  }

  public getVelocity() {
    var cXpX, cYpY;

    cXpX = this.cur.x - this.prev.x;
    cYpY = this.cur.y - this.prev.y;

    return cXpX * cXpX + cYpY * cYpY;
  }
  public draw(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    ctx.lineWidth = 1;
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.arc(
      this.cur.x * scaleFactor,
      this.cur.y * scaleFactor,
      2.0,
      0.0,
      Math.PI * 2.0,
      true
    );
    ctx.fill();
  }
}
