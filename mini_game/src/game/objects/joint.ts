import Vector2 from "../core/vector2";
import PointMass from "./point_mass";

export default class Joint {
  public pointMassA: PointMass;
  public pointMassB: PointMass;
  public delta: Vector2;
  public pointMassAPos: Vector2;
  public pointMassBPos: Vector2;
  public shortConst: number;
  public longConst: number;
  private scSquared: number;
  private lcSquared: number;

  constructor(
    pointMassA: PointMass,
    pointMassB: PointMass,
    shortConst: number,
    longConst: number
  ) {
    this.pointMassA = pointMassA;
    this.pointMassB = pointMassB;
    this.delta = new Vector2(0.0, 0.0);
    this.pointMassAPos = pointMassA.cur;
    this.pointMassBPos = pointMassB.cur;
    this.delta.set(this.pointMassBPos.x, this.pointMassBPos.y);
    this.delta.sub(this.pointMassAPos);
    this.shortConst = this.delta.length() * shortConst;
    this.longConst = this.delta.length() * longConst;
    this.scSquared = this.shortConst * this.shortConst;
    this.lcSquared = this.longConst * this.longConst;
  }

  public setDist(shortConst: number, longConst: number) {
    this.shortConst = shortConst;
    this.longConst = longConst;
    this.scSquared = this.shortConst * this.shortConst;
    this.lcSquared = this.longConst * this.longConst;
  }

  public scale(scaleFactor: number) {
    this.shortConst = this.shortConst * scaleFactor;
    this.longConst = this.longConst * scaleFactor;
    this.scSquared = this.shortConst * this.shortConst;
    this.lcSquared = this.longConst * this.longConst;
  }

  public sc() {
    this.delta.set(this.pointMassBPos.x, this.pointMassBPos.y);
    this.delta.sub(this.pointMassAPos);
    var dp = this.delta.dot(this.delta);
    if (this.shortConst != 0.0 && dp < this.scSquared) {
      var scaleFactor;
      scaleFactor = this.scSquared / (dp + this.scSquared) - 0.5;
      this.delta.multiplyScalar(scaleFactor);
      this.pointMassAPos.sub(this.delta);
      this.pointMassBPos.add(this.delta);
      this.pointMassA.cur.set(this.pointMassAPos.x, this.pointMassAPos.y);
      this.pointMassB.cur.set(this.pointMassBPos.x, this.pointMassBPos.y);
    } else if (this.longConst != 0.0 && dp > this.lcSquared) {
      var scaleFactor;
      scaleFactor = this.lcSquared / (dp + this.lcSquared) - 0.5;
      this.delta.multiplyScalar(scaleFactor);
      this.pointMassAPos.sub(this.delta);
      this.pointMassBPos.add(this.delta);
      this.pointMassA.cur.set(this.pointMassAPos.x, this.pointMassAPos.y);
      this.pointMassB.cur.set(this.pointMassBPos.x, this.pointMassBPos.y);
    }
  }
}
