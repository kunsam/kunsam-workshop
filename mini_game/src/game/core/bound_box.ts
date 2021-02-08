import Vector2 from "./vector2";

export class RectBoundBox {
  public left: number;
  public right: number;
  public top: number;
  public buttom: number;
  public r: Vector2;
  constructor(x: number, y: number, w: number, h: number) {
    this.left = x;
    this.right = x + w;
    this.top = y;
    this.buttom = y + h;
    this.r = new Vector2(0.0, 0.0);
  }

  public collision(curPos: Vector2): { collide: boolean } {
    var collide: boolean = false;
    if (curPos.x < this.left) {
      curPos.setX(this.left);
      collide = true;
    } else if (curPos.x > this.right) {
      curPos.setX(this.right);
      collide = true;
    }
    if (curPos.y < this.top) {
      curPos.setY(this.top);
      collide = true;
    } else if (curPos.y > this.buttom) {
      curPos.setY(this.buttom);
      collide = true;
    }
    return {
      collide,
    };
  }
}
