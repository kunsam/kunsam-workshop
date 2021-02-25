import { RectBoundBox } from "../../core/bound_box";
import LineSegment from "../../core/line_segment";
import Polygon from "../../core/polygon";
import Vector2 from "../../core/vector2";
import ObjBlob from "../../objects/blob";
import ObjBlobCollective from "../../objects/blob_collective";
import { GameBlobNamespace } from "../../typings/game_blob";
import { GameGeometry } from "../../typings/game_geometry";
import { getInitEjectArea } from "./ui_config";
function getTouchCoords(ev: TouchEvent): GameGeometry.IVector2 {
  const touch = ev.touches[0];
  if (!touch) {
    return [0, 0];
  }
  return [touch.pageX, touch.pageY];
}

export enum PlayMode {
  "joint" = "joint",
  "split" = "split",
}

export interface IDistanceBlobTarget {
  blob?: ObjBlob;
  distance: number;
  blobCollective?: ObjBlobCollective;
}

export default class PlayBlobsManager {
  public idNumber: number = 0;
  public blobs: Map<string, ObjBlobCollective> = new Map();
  public MAX_BLOBS_NUM = 8;

  public gravity = new Vector2(0.0, 1000.0);
  public playmode: PlayMode = PlayMode.joint;

  // 活动区域
  public activePolygon: Polygon;
  public reactBoundBox: RectBoundBox;
  // 移除的范围
  public removeBoundBox: RectBoundBox;

  constructor(canvasSize: GameGeometry.IVector2) {
    this.activePolygon = new Polygon([
      [0, canvasSize[1] - 300],
      [canvasSize[0], canvasSize[1] - 300],
      [canvasSize[0], canvasSize[1]],
      [0, canvasSize[1]],
    ]);
    this.reactBoundBox = new RectBoundBox(
      0,
      canvasSize[1] - 400,
      canvasSize[0],
      300
    );
    const iarea = getInitEjectArea(canvasSize[0], canvasSize[1]);
    this.removeBoundBox = new RectBoundBox(
      iarea.x,
      iarea.y,
      iarea.width,
      iarea.height
    );
  }

  public DEFAULT_BLOB_CONFIG: GameBlobNamespace.BlobCollectiveConfig = {
    firstBlob: {
      radius: 30,
      numPointMasses: 8,
    },
    collectMaxNum: 8,
  };

  private getId() {
    return `PlayBlobsManager-BlobCollective-${this.idNumber++}`;
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

  public delete(id: string) {
    this.blobs.delete(id);
  }

  public addCollective(bc: ObjBlobCollective) {
    const collectiveId = this.getId();
    bc.id = collectiveId;
    this.blobs.set(collectiveId, bc);
  }

  public unselect() {
    if (this.selectedBlobCollective) {
      this.selectedBlobCollective.bc.unselectBlob();
    }
    this.selectedBlobCollective = undefined;
  }

  public removeBlob(bc: ObjBlobCollective, target: ObjBlob) {
    bc.removeBlob(target);
    if (bc.blobs.length === 0) {
      this.delete(bc.id);
    }
  }

  public findClosestBlobCollective(
    target: ObjBlob,
    excludeId: string[]
  ): IDistanceBlobTarget {
    const excludeSet = new Set(excludeId);
    let minDistance = 10000;
    let minBlobCollective: ObjBlobCollective;
    let minBlob: ObjBlob;
    this.blobs.forEach((blobc) => {
      if (excludeSet.has(blobc.id)) {
        return;
      }
      blobc.blobs.forEach((blob) => {
        const distance = new Vector2()
          .subVectors(target.middlePointMass.cur, blob.middlePointMass.cur)
          .length();
        if (distance < minDistance) {
          minBlobCollective = blobc;
          minBlob = blob;
          minDistance = distance;
        }
      });
    });
    return {
      distance: minDistance,
      blobCollective: minBlobCollective,
      blob: minBlob,
    };
  }

  public findPerpenClosesetBlobCollective(
    pathV2: LineSegment
  ): IDistanceBlobTarget {
    let minDistance = 10000;
    let minBlobCollective: ObjBlobCollective;
    let minBlob: ObjBlob;

    this.blobs.forEach((blobc) => {
      blobc.blobs.forEach((blob) => {
        const middlePointV2 = pathV2.middlePoint();
        const perpenDistance = blob.middlePointMass.cur.distanceTo(
          middlePointV2
        );
        if (perpenDistance <= blob.radius && perpenDistance < minDistance) {
          minBlob = blob;
          minBlobCollective = blobc;
          minDistance = perpenDistance;
        }
      });
    });

    return {
      distance: minDistance,
      blobCollective: minBlobCollective,
      blob: minBlob,
    };
  }

  // 单次只能切割一次
  private splitedInOneTouchProgress = false;
  public handleSplit(ev: TouchEvent): { handled: boolean } {
    if (this.splitedInOneTouchProgress) {
      return { handled: false };
    }
    if (!this.selectedBlobCollective && this.savedTouchStartCoords) {
      const touchcoords = getTouchCoords(ev);
      const movePath = new LineSegment(
        new Vector2(
          this.savedTouchStartCoords[0],
          this.savedTouchStartCoords[1]
        ),
        new Vector2(touchcoords[0], touchcoords[1])
      );
      if (movePath.length() > 30) {
        const findData = this.findPerpenClosesetBlobCollective(movePath);
        if (findData.blob) {
          findData.blobCollective.split();
          this.splitedInOneTouchProgress = true;
        }
      }
    }
    return {
      handled: false,
    };
  }

  public handleJoint(): { handled: boolean } {
    // const touchcoords = getTouchCoords(ev);

    if (
      this.selectedBlobCollective &&
      this.selectedBlobCollective.bc.selectedBlob
    ) {
      const selectedBc = this.selectedBlobCollective.bc;
      const selectedBlob = selectedBc.selectedBlob;
      const findData = this.findClosestBlobCollective(selectedBlob, [
        selectedBc.id,
      ]);
      // 选中的必须比目标半径小
      if (
        findData.blobCollective &&
        findData.blob &&
        selectedBlob.radius <= findData.blob.radius
      ) {
        const success = findData.blobCollective.joint(
          selectedBlob,
          findData.blob
        );
        if (success) {
          this.removeBlob(selectedBc, selectedBlob);
          return {
            handled: true,
          };
        }
      }
    }
    return {
      handled: false,
    };
  }

  public selectedBlobCollective: {
    bc: ObjBlobCollective;
    offset: Vector2;
  };

  private savedTouchStartCoords: GameGeometry.IVector2;
  private savedTouchMoveCoords: GameGeometry.IVector2;

  public ontouchstart = (ev: TouchEvent) => {
    const touchcoords = getTouchCoords(ev);
    let minselectOffset: Vector2 = new Vector2(10000, 10000);
    let minselectblobCollective: ObjBlobCollective;
    let minselectblob: ObjBlob;
    this.blobs.forEach((bc) => {
      const selectData = bc.getSelectData(touchcoords[0], touchcoords[1]);
      if (selectData) {
        if (selectData.offset.length() < minselectOffset.length()) {
          minselectOffset = selectData.offset;
          minselectblobCollective = bc;
          minselectblob = selectData.blob;
        }
      }
    });
    if (minselectblobCollective) {
      this.selectedBlobCollective = {
        bc: minselectblobCollective,
        offset: minselectOffset,
      };
      minselectblobCollective.selectBlob(minselectblob);
    }
    this.savedTouchStartCoords = touchcoords;
  };

  public ontouchmove = (ev: TouchEvent) => {
    if (this.playmode === PlayMode.split) {
      const handle = this.handleSplit(ev);
      if (handle.handled) {
        return;
      }
    }

    if (
      this.selectedBlobCollective &&
      this.selectedBlobCollective.bc.selectedBlob
    ) {
      const touchcoords = getTouchCoords(ev);
      const { collide } = this.removeBoundBox.collision(
        new Vector2(touchcoords[0], touchcoords[1])
      );
      if (!collide) {
        this.removeBlob(
          this.selectedBlobCollective.bc,
          this.selectedBlobCollective.bc.selectedBlob
        );
        // this.delete(this.selectedBlobCollective.bc.id);
        // this.unselect();
        this.savedTouchMoveCoords = undefined;
        return;
      }

      if (this.playmode === "joint") {
        // playmode
        const handleJoint = this.handleJoint();
        if (handleJoint.handled) {
          return;
        }
      }
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
      this.savedTouchStartCoords = undefined;
    }
    this.splitedInOneTouchProgress = false;
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
    this.blobs.forEach((bc) => {
      bc.draw(ctx, scaleFactor);
      this.update(bc);
    });
  }

  public togglePlayMode() {
    if (this.playmode === PlayMode.joint) {
      this.playmode = PlayMode.split;
    } else {
      this.playmode = PlayMode.joint;
    }
  }
}
