import { RectBoundBox } from "../../core/bound_box";
import Polygon from "../../core/polygon";
import Vector2 from "../../core/vector2";
import ObjBlobCollective from "../../objects/blob_collective";
import { GameBlobNamespace } from "../../typings/game_blob";
import { GameGeometry } from "../../typings/game_geometry";
function getTouchCoords(ev: TouchEvent): GameGeometry.IVector2 {
  const touch = ev.touches[0];
  if (!touch) {
    return [0, 0];
  }
  return [touch.pageX, touch.pageY];
}

export default class PlayBlobsManager {
  public blobs: Map<string, ObjBlobCollective> = new Map();

  public gravity = new Vector2(0.0, 1000.0);

  constructor() {}

  public MAX_BLOBS_NUM = 8;

  // 活动区域
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

  private getId() {
    return `PlayBlobsManager-BlobCollective-${this.blobs.size}`;
  }

  public add(
    cx: number,
    cy: number,
    config?: GameBlobNamespace.BlobCollectiveConfig
  ) {
    if (this.blobs.size >= this.MAX_BLOBS_NUM) {
      return;
    }
    const collectiveId = this.getId();
    const bconfig = config || this.DEFAULT_BLOB_CONFIG;
    this.blobs.set(
      collectiveId,
      new ObjBlobCollective({
        id: collectiveId,
        firstBlob: {
          id: `${collectiveId}-Blob-0`,
          cx,
          cy,
          ...bconfig.firstBlob,
        },
        collectMaxNum: bconfig.collectMaxNum,
      })
    );
  }

  public addCollective(bc: ObjBlobCollective) {
    const collectiveId = this.getId();
    bc.id = collectiveId;
    this.blobs.set(collectiveId, bc);
  }

  public selectedBlobCollective: {
    bc: ObjBlobCollective;
    offset: Vector2;
  };
  private savedTouchMoveCoords: GameGeometry.IVector2;

  public ontouchstart = (ev: TouchEvent) => {
    const touchcoords = getTouchCoords(ev);
    let minselectOffset: Vector2 = new Vector2(10000, 10000);
    let minselectblob: ObjBlobCollective;
    this.blobs.forEach((bc) => {
      const selectData = bc.getSelectData(touchcoords[0], touchcoords[1]);
      if (selectData) {
        if (selectData.offset.length() < minselectOffset.length()) {
          minselectOffset = selectData.offset;
          minselectblob = bc;
        }
      }
    });
    console.log(minselectblob, "minselectblob");
    if (minselectblob) {
      this.selectedBlobCollective = {
        bc: minselectblob,
        offset: minselectOffset,
      };
    }
    console.log(this.blobs, "this.blobs");
  };

  public ontouchmove = (ev: TouchEvent) => {
    if (this.selectedBlobCollective) {
      const touchcoords = getTouchCoords(ev);

      this.selectedBlobCollective.bc.selectedBlobMoveTo(
        touchcoords[0] - this.selectedBlobCollective.offset.x,
        touchcoords[1] - this.selectedBlobCollective.offset.y
      );

      this.savedTouchMoveCoords = touchcoords;
    }
  };

  public ontouchend = (ev: TouchEvent) => {
    if (this.selectedBlobCollective) {
      this.selectedBlobCollective.bc.unselectBlob();
      this.selectedBlobCollective = undefined;
      this.savedTouchMoveCoords = undefined;
    }
  };

  public update(blobColl: ObjBlobCollective) {
    var dt = 0.016;
    if (this.selectedBlobCollective) {
      if (this.selectedBlobCollective.bc.id === blobColl.id) {
        const selectOffset = this.selectedBlobCollective.offset;
        if (this.savedTouchMoveCoords && selectOffset) {
          blobColl.selectedBlobMoveTo(
            this.savedTouchMoveCoords[0] - selectOffset.x,
            this.savedTouchMoveCoords[1] - selectOffset.y
          );
        }
      }
    }
    blobColl.move(dt);
    blobColl.sc(this.activePolygon, this.reactBoundBox);
    blobColl.setForce(this.gravity);
  }

  public draw(ctx: CanvasRenderingContext2D, scaleFactor: number) {
    // console.log(this.blobs, 'this.blobs')
    this.blobs.forEach((bc) => {
      bc.draw(ctx, scaleFactor);
      this.update(bc);
    });
  }
}
