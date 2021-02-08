import { RectBoundBox } from "../core/bound_box";
import LineSegment from "../core/line_segment";
import Polygon from "../core/polygon";
import Vector2 from "../core/vector2";
import { GameBlobNamespace } from "../typings/game_blob";
import Joint from "./joint";
import PointMass from "./point_mass";
import Stick from "./stick";

// 标准化缩放因子
const DEGIGN_SCALE_FACTOR = 100;

export default class ObjBlob {
  public id: string;
  public x: number;
  public y: number;
  public sticks: Stick[];
  private joints: Joint[];

  public middlePointMass: PointMass;
  private pointMasses: PointMass[];

  private drawFaceStyle: number;
  private drawEyeStyle: number;

  public selected: boolean;

  private numPointMasses: number;

  public radius: number;

  constructor({
    cx,
    cy,
    radius,
    numPointMasses,
    id,
  }: GameBlobNamespace.ObjBlobProps) {
    // this.radius = radius
    this.id = id;
    this.x = cx;
    this.y = cy;
    this.sticks = new Array();
    this.pointMasses = new Array();
    this.joints = new Array();
    this.middlePointMass = new PointMass(cx, cy, 1.0);
    this.radius = radius;
    this.drawFaceStyle = 1;
    this.drawEyeStyle = 1;
    this.selected = false;
    this.numPointMasses = numPointMasses;

    let t, i, p;
    for (i = 0, t = 0.0; i < numPointMasses; i++) {
      this.pointMasses[i] = new PointMass(
        Math.cos(t) * radius + cx,
        Math.sin(t) * radius + cy,
        1.0
      );
      t += (2.0 * Math.PI) / numPointMasses;
    }

    this.pointMasses[0].mass = 4.0;
    this.pointMasses[1].mass = 4.0;

    function clampIndex(index: number, maxIndex: number) {
      index += maxIndex;
      return index % maxIndex;
    }

    for (i = 0; i < numPointMasses; i++) {
      this.sticks[i] = new Stick({
        pointMassA: this.pointMasses[i],
        pointMassB: this.pointMasses[clampIndex(i + 1, numPointMasses)],
      });
    }
    var low = 0.95,
      high = 1.05;

    for (i = 0, p = 0; i < numPointMasses; i++) {
      this.joints[p++] = new Joint(
        this.pointMasses[i],
        this.pointMasses[
          clampIndex(i + numPointMasses / 2 + 1, numPointMasses)
        ],
        low,
        high
      );
      this.joints[p++] = new Joint(
        this.pointMasses[i],
        this.middlePointMass,
        high * 0.9,
        low * 1.1
      ); // 0.8, 1.2 works
    }
  }

  private getPointMass(index: number) {
    index += this.pointMasses.length;
    index = index % this.pointMasses.length;
    return this.pointMasses[index];
  }

  public move(dt: number) {
    var i;
    for (i = 0; i < this.pointMasses.length; i++) {
      this.pointMasses[i].move(dt);
    }
    this.middlePointMass.move(dt);
  }

  public moveTo(x: number, y: number) {
    var i, blobPos: Vector2;

    blobPos = this.middlePointMass.cur;
    x -= blobPos.x;
    y -= blobPos.y;

    for (i = 0; i < this.pointMasses.length; i++) {
      blobPos = this.pointMasses[i].cur;
      blobPos.setX(blobPos.x + x);
      blobPos.setY(blobPos.y + y);
    }
    blobPos = this.middlePointMass.cur;
    blobPos.setX(blobPos.x + x);
    blobPos.setY(blobPos.y + y);
  }
  /**
   * 多边形碰撞修正还不成熟，如果不使用碰撞改变力，会出现临界跳动和逃逸问题
   *
   * @param {Polygon} polygon
   * @param {Vector2} point
   * @param {Vector2} [prePoint]
   * @return {*}
   * @memberof ObjBlob
   */
  public getCollisionPoint(
    polygon: Polygon,
    point: Vector2,
    prePoint?: Vector2
  ): Vector2 | undefined {
    let startPoint = prePoint;
    if (!startPoint) {
      const centroid = polygon.centroid();
      startPoint = new Vector2(centroid[0], centroid[1]);
    }
    const movePathSegment = new LineSegment(startPoint, point);

    let prevPoint = new Vector2(polygon.hull[0][0], polygon.hull[0][1]);
    let intersectPoint: Vector2 | undefined;

    let str = "";
    const array = [...polygon.hull.slice(1), polygon.hull[0]];
    array.every((pt) => {
      const currentPt = new Vector2(pt[0], pt[1]);
      const polygonSeg = new LineSegment(prevPoint, currentPt);
      const insectPt = polygonSeg.intersectLineSegment(movePathSegment, 0);
      intersectPoint = insectPt;
      prevPoint = currentPt;
      str += `lineseg(${polygonSeg.startPoint.x}|${polygonSeg.startPoint.y} ${polygonSeg.endPoint.x}|${polygonSeg.endPoint.y})`;
      if (intersectPoint) {
        str += `lineseg(${movePathSegment.startPoint.x}|${movePathSegment.startPoint.y} ${movePathSegment.endPoint.x}|${movePathSegment.endPoint.y})`;
        console.log(`%c${str}`, "color: blue;");
      }
      return !intersectPoint;
    });

    return intersectPoint;
  }

  public sc(_: Polygon, box: RectBoundBox) {
    var i, j;

    for (i = 0; i < this.pointMasses.length; i++) {
      const pos = this.pointMasses[i].cur;
      // const intsectPt = this.getCollisionPoint(
      //   polygon,
      //   pos,
      //   this.pointMasses[i].prev
      // );
      const { collide } = box.collision(pos);
      if (collide) {
        this.pointMasses[i].friction = 0.75;
      } else {
        this.pointMasses[i].friction = 0.01;
      }
    }

    for (i = 0; i < this.sticks.length; i++) {
      this.sticks[i].sc();
    }

    for (i = 0; i < this.joints.length; i++) {
      this.joints[i].sc();
    }
  }

  public setForce(force: Vector2) {
    var i;
    for (i = 0; i < this.pointMasses.length; i++) {
      this.pointMasses[i].force = force;
    }
    this.middlePointMass.force = force;
  }
  public drawBody(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    var i;

    ctx.strokeStyle = "#000000";
    if (this.selected == true) {
      ctx.fillStyle = "#FFCCCC";
    } else {
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.lineWidth = 5;
    ctx.beginPath();

    ctx.moveTo(
      this.pointMasses[0].cur.x * scaleFactor,
      this.pointMasses[0].cur.y * scaleFactor
    );

    for (i = 0; i < this.pointMasses.length; i++) {
      var px, py, nx, ny, tx, ty, cx, cy;
      var prevPointMass, currentPointMass, nextPointMass, nextNextPointMass;

      prevPointMass = this.getPointMass(i - 1);
      currentPointMass = this.pointMasses[i];
      nextPointMass = this.getPointMass(i + 1);
      nextNextPointMass = this.getPointMass(i + 2);

      tx = nextPointMass.cur.x;
      ty = nextPointMass.cur.y;

      cx = currentPointMass.cur.x;
      cy = currentPointMass.cur.y;

      px = cx * 0.5 + tx * 0.5;
      py = cy * 0.5 + ty * 0.5;

      nx = cx - prevPointMass.cur.x + tx - nextNextPointMass.cur.x;
      ny = cy - prevPointMass.cur.y + ty - nextNextPointMass.cur.y;

      px += nx * 0.16;
      py += ny * 0.16;

      px = px * scaleFactor;
      py = py * scaleFactor;

      tx = tx * scaleFactor;
      ty = ty * scaleFactor;

      ctx.bezierCurveTo(px, py, tx, ty, tx, ty);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
  public draw(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    this.drawBody(ctx, scaleFactor);

    this.pointMasses[0].draw(ctx, scaleFactor);
    this.pointMasses[1].draw(ctx, scaleFactor);
    this.sticks.forEach((stick) => stick.draw(ctx, scaleFactor));

    // ctx.strokeStyle = "#000000";
    // ctx.fillStyle = "#000000";
    // ctx.save();
    // ctx.translate(
    //   this.middlePointMass.cur.x * scaleFactor,
    //   (this.middlePointMass.cur.y - 0.35 * this.radius) * scaleFactor
    // );
    // const up = new Vector2(0.0, -1.0);
    // const ori = new Vector2(0.0, 0.0);
    // const cur0 = this.pointMasses[0].cur;
    // ori.set(cur0.x, cur0.y);
    // const cur_middle = this.middlePointMass.cur;
    // ori.sub(cur_middle);
    // const ang = Math.acos(ori.dot(up) / ori.length());
    // if (ori.x < 0.0) {
    //   ctx.rotate(-ang);
    // } else {
    //   ctx.rotate(ang);
    // }
    // this.drawEars(ctx, scaleFactor);
    // this.drawFace(ctx, scaleFactor);
    // ctx.restore();
  }
}
