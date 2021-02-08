import Vector2 from "../core/vector2";
import PointMass from "./point_mass";

export default class Stick {
  public length: number;
  public pointMassA: PointMass;
  public pointMassB: PointMass;
  public lengthSquared: number;
  public delta: Vector2;

  constructor({
    pointMassA,
    pointMassB,
  }: {
    pointMassA: PointMass;
    pointMassB: PointMass;
  }) {
    this.length = this.pointMassDist(pointMassA, pointMassB);
    this.pointMassA = pointMassA;
    this.pointMassB = pointMassB;
    this.lengthSquared = this.length * this.length;
    this.delta = new Vector2(0.0, 0.0);
  }

  public pointMassDist(pointMassA: PointMass, pointMassB: PointMass) {
    var aXbX, aYbY;

    aXbX = pointMassA.cur.x - pointMassB.cur.x;
    aYbY = pointMassA.cur.y - pointMassB.cur.y;

    return Math.sqrt(aXbX * aXbX + aYbY * aYbY);
  }

  public scale(scaleFactor: number) {
    this.length *= scaleFactor;
    this.lengthSquared = this.length * this.length;
  }

  public sc() {
    var dotProd, scaleFactor;
    var pointMassAPos, pointMassBPos;

    pointMassAPos = this.pointMassA.cur;
    pointMassBPos = this.pointMassB.cur;

    this.delta.set(pointMassBPos.x, pointMassBPos.y);
    this.delta.sub(pointMassAPos);

    dotProd = this.delta.dot(this.delta);

    scaleFactor = this.lengthSquared / (dotProd + this.lengthSquared) - 0.5;
    this.delta.multiplyScalar(scaleFactor);

    pointMassAPos.sub(this.delta);
    pointMassBPos.add(this.delta);

    this.pointMassA.cur.set(pointMassAPos.x, pointMassAPos.y);
    this.pointMassB.cur.set(pointMassBPos.x, pointMassBPos.y);
  }

  public setForce(force: Vector2) {
    this.pointMassA.force = force.clone();
    this.pointMassB.force = force.clone();
  }

  public addForce(force: Vector2) {
    this.pointMassA.force.add(force);
    this.pointMassB.force.add(force);
  }
  public move(dt: number) {
    this.pointMassA.move(dt);
    this.pointMassB.move(dt);
  }
  public draw(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    this.pointMassA.draw(ctx, scaleFactor);
    this.pointMassB.draw(ctx, scaleFactor);

    ctx.lineWidth = 3;
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(
      this.pointMassA.cur.x * scaleFactor,
      this.pointMassA.cur.y * scaleFactor
    );
    ctx.lineTo(
      this.pointMassB.cur.x * scaleFactor,
      this.pointMassB.cur.y * scaleFactor
    );
    ctx.stroke();
  }
}
