import { RectBoundBox } from "../core/bound_box";
import Polygon from "../core/polygon";
import Vector2 from "../core/vector2";
import { GameBlobNamespace } from "../typings/game_blob";
import ObjBlob from "./blob";

export default class ObjBlobCollective {
  private maxNum: number;
  // private numActive: number;
  private tmpForce: Vector2;
  public blobs: ObjBlob[];

  public id: string;
  constructor({
    id,
    collectMaxNum,
    firstBlob,
  }: GameBlobNamespace.BlobCollectiveProps) {
    this.id = id;
    this.maxNum = collectMaxNum;
    // this.numActive = 1;
    this.blobs = new Array();
    this.tmpForce = new Vector2(0.0, 0.0);
    this.selectedBlob = null;
    this.blobs[0] = new ObjBlob(firstBlob);
  }

  public selectedBlob: ObjBlob;
  public getSelectData(
    x: number,
    y: number
  ): { offset: Vector2; blob: ObjBlob } | undefined {
    var i,
      minDist = 10000.0;
    var otherPointMass;
    var selectOffset = null;
    let selectedBlob: ObjBlob;

    if (this.selectedBlob != null) {
      return;
    }

    for (i = 0; i < this.blobs.length; i++) {
      if (this.blobs[i] == null) {
        continue;
      }
      otherPointMass = this.blobs[i].middlePointMass;
      const aXbX = x - otherPointMass.cur.x;
      const aYbY = y - otherPointMass.cur.y;
      const dist = Math.sqrt(aXbX * aXbX + aYbY * aYbY);
      if (dist < minDist) {
        minDist = dist;
        const ValidSelectedRadius = this.blobs[i].radius * 1;
        if (dist < ValidSelectedRadius) {
          selectedBlob = this.blobs[i];
          selectOffset = { x: aXbX, y: aYbY };
        }
      }
    }

    // if (this.selectedBlob != null) {
    //   this.selectedBlob.selected = true;
    // }
    if (selectOffset && selectedBlob) {
      return {
        blob: selectedBlob,
        offset: new Vector2(selectOffset.x, selectOffset.y),
      };
    }
    return undefined;
  }

  public removeBlob(blob: ObjBlob) {
    this.blobs = this.blobs.filter((b) => b.id !== blob.id);
    if (this.selectedBlob.id === blob.id) {
      this.unselectBlob();
    }
  }
  public selectBlob(blob: ObjBlob) {
    this.selectedBlob = blob;
    this.selectedBlob.selected = true;
  }
  public unselectBlob() {
    if (this.selectedBlob == null) {
      return;
    }
    this.selectedBlob.selected = false;
    this.selectedBlob = null;
  }

  public selectedBlobMoveTo(x: number, y: number) {
    if (this.selectedBlob == null) {
      return;
    }
    this.selectedBlob.moveTo(x, y);
  }

  public draw(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    for (let i = 0; i < this.blobs.length; i++) {
      if (this.blobs[i] == null) {
        continue;
      }
      this.blobs[i].draw(ctx, scaleFactor);
    }
  }

  public move(dt: number) {
    var i;
    for (i = 0; i < this.blobs.length; i++) {
      if (this.blobs[i] == null) {
        continue;
      }
      this.blobs[i].move(dt);
    }
  }

  public sc(polygon: Polygon, box: RectBoundBox) {
    var i;

    for (i = 0; i < this.blobs.length; i++) {
      if (this.blobs[i] == null) {
        continue;
      }
      this.blobs[i].sc(polygon, box);
    }
  }

  public setForce(force: Vector2) {
    var i;

    for (i = 0; i < this.blobs.length; i++) {
      if (this.blobs[i] == null) {
        continue;
      }
      if (this.blobs[i] == this.selectedBlob) {
        this.blobs[i].setForce(new Vector2(0.0, 0.0));
        continue;
      }
      this.blobs[i].setForce(force);
    }
  }

  public joint(jointedBlob: ObjBlob, InThisTargetBlob: ObjBlob): boolean {
    const targetBlobIndex = this.blobs.findIndex(
      (b) => b.id === InThisTargetBlob.id
    );
    if (targetBlobIndex < 0) {
      return false;
    }
    const r1 = jointedBlob.radius;
    const r2 = InThisTargetBlob.radius;
    const r3 = Math.sqrt(r1 * r1 + r2 * r2);
    this.blobs[targetBlobIndex].scale((0.945 * r3) / r2);
    return true;
  }

  public split() {
    var i,
      maxIndex = 0,
      maxRadius = 0.0;
    var emptySlot;
    var motherBlob, newBlob;

    emptySlot = this.blobs.length;
    for (i = 0; i < this.blobs.length; i++) {
      if (this.blobs[i] != null && this.blobs[i].radius > maxRadius) {
        maxRadius = this.blobs[i].radius;
        motherBlob = this.blobs[i];
      } else if (this.blobs[i] == null) {
        emptySlot = i;
      }
    }

    motherBlob.scale(0.75);
    newBlob = new ObjBlob({
      id: `${this.blobs.length + 1}`,
      cx: motherBlob.middlePointMass.cur.x,
      cy: motherBlob.middlePointMass.cur.y,
      radius: motherBlob.radius,
      numPointMasses: 8,
    });

    for (i = 0; i < this.blobs.length; i++) {
      if (this.blobs[i] == null) {
        continue;
      }
      this.blobs[i].addBlob(newBlob);
      newBlob.addBlob(this.blobs[i]);
    }
    this.blobs[emptySlot] = newBlob;
  }
}
