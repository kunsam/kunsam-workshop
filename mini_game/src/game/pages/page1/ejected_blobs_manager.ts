import { RectBoundBox } from "../../core/bound_box";
import Polygon from "../../core/polygon";
import Vector2 from "../../core/vector2";
import ObjBlobCollective from "../../objects/blob_collective";
import { GameBlobNamespace } from "../../typings/game_blob";

export default class EjectedBlobsManager {
  public idNumber: number = 0;
  public blobs: Map<string, ObjBlobCollective> = new Map();
  private onBlobEjectedFinish: (bcollective: ObjBlobCollective) => void;
  private ejectDuration: number;
  constructor({
    ejectDuration = 1000,
    onBlobEjectedFinish,
  }: {
    ejectDuration?: number;
    onBlobEjectedFinish: (bcollective: ObjBlobCollective) => void;
  }) {
    this.ejectDuration = ejectDuration;
    this.onBlobEjectedFinish = onBlobEjectedFinish;
  }

  public MAX_BLOBS_NUM = 8;
  public activePolygon: Polygon = new Polygon([
    [0, 367],
    [375, 367],
    [375, 667],
    [0, 667],
  ]);

  public reactBoundBox: RectBoundBox = new RectBoundBox(0, 367, 375, 300);

  public DEFAULT_BLOB_CONFIG: GameBlobNamespace.BlobCollectiveConfig = {
    firstBlob: {
      radius: 30,
      numPointMasses: 8,
    },
    collectMaxNum: 8,
  };

  public delete(id: string) {
    this.blobs.delete(id);
  }

  public add(
    cx: number,
    cy: number,
    config?: GameBlobNamespace.BlobCollectiveConfig
  ) {
    if (this.blobs.size >= this.MAX_BLOBS_NUM) {
      return;
    }
    const collectiveId = `EjectedBlobsManager-BlobCollective-${this
      .idNumber++}`;
    const bconfig = config || this.DEFAULT_BLOB_CONFIG;

    const bc = new ObjBlobCollective({
      id: collectiveId,
      firstBlob: {
        id: `${collectiveId}-Blob-0`,
        cx,
        cy,
        ...bconfig.firstBlob,
      },
      collectMaxNum: bconfig.collectMaxNum,
    });
    this.blobs.set(collectiveId, bc);

    setTimeout(() => {
      bc.setForce(new Vector2(0, 0));
      this.delete(bc.id);
      this.onBlobEjectedFinish(bc);
    }, this.ejectDuration);
  }

  public update(blobColl: ObjBlobCollective) {
    blobColl.move(0.016);
    blobColl.sc(this.activePolygon, this.reactBoundBox);
    blobColl.setForce(new Vector2(-500, 500));
  }

  public draw(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    this.blobs.forEach((bc) => {
      bc.draw(ctx, scaleFactor);
      this.update(bc);
    });
  }
}
