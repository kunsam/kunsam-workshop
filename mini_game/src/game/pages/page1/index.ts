import GesturesArea, { GesturesAreaSwipeEvent } from "../../core/gesture_area";
import { TouchableAreaEvents } from "../../core/touchable_area";
import { drawPolygon } from "../../draw/polygon";
import { getPointsFromRect } from "../../map/rect_2_points";
import ObjBlobCollective from "../../objects/blob_collective";
import GamePage from "../../page";
import { GameGeometry } from "../../typings/game_geometry";
import GAME_ALL_PAGE_KEYS from "../all_page_key";
import EjectedBlobsManager from "./ejected_blobs_manager";
import PlayBlobsManager, { PlayMode } from "./play_blobs_manager";
import { PlayModeButton } from "./play_mode_button";
import { getInitEjectArea, getPlayButtonArea } from "./ui_config";

function getTouchCoords(ev: TouchEvent): GameGeometry.IVector2 {
  const touch = ev.touches[0];
  if (!touch) {
    return [0, 0];
  }
  return [touch.pageX, touch.pageY];
}

export default class GamePage1 extends GamePage {
  public id = GAME_ALL_PAGE_KEYS.page1;

  private _initEjectArea: GesturesArea;

  private _togglePlayModeButton: PlayModeButton;

  private _testObjBlobCollective: ObjBlobCollective;

  private _ejectedBlobManager: EjectedBlobsManager;
  private _playBlobManager: PlayBlobsManager;

  public SCALE_FACTOR = 1;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvasSize: GameGeometry.IVector2
  ) {
    super(ctx, canvasSize);
    const iarea = getInitEjectArea(canvasSize[0], canvasSize[1]);
    console.log(canvasSize, "canvasSize");
    this._initEjectArea = new GesturesArea(
      getPointsFromRect(iarea.x, iarea.y, iarea.width, iarea.height),
      {
        distance: 100,
        angelRangeInDegree: [90, 270],
        mode: "instantaneous",
      }
    );

    const pbArea = getPlayButtonArea(canvasSize[0], canvasSize[1]);
    this._togglePlayModeButton = new PlayModeButton(
      getPointsFromRect(pbArea.x, pbArea.y, pbArea.width, pbArea.height)
    );
    this._togglePlayModeButton.addEventListeners(
      TouchableAreaEvents.click,
      this.handleTogglePlayMode.bind(this)
    );

    this._initEjectArea.addGestureEventListeners(
      "swipeout",
      this.onEjectInitBlob
    );
    this.SCALE_FACTOR = canvasSize[0] / 375;

    this._ejectedBlobManager = new EjectedBlobsManager({
      onBlobEjectedFinish: this.handleBlobEejectFinish.bind(this),
    });
    this._playBlobManager = new PlayBlobsManager(canvasSize);
  }

  public handleTogglePlayMode() {
    this._playBlobManager.togglePlayMode();
  }

  public handleBlobEejectFinish(bcollective: ObjBlobCollective) {
    this._playBlobManager.addCollective(bcollective);
  }

  public ontouchstart = (ev: TouchEvent) => {
    this._initEjectArea.ontouchstart(ev);
    this._togglePlayModeButton.ontouchstart(ev);
    this._playBlobManager.ontouchstart(ev);
  };
  public ontouchmove = (ev: TouchEvent) => {
    // console.log("ontouchmove");
    this._initEjectArea.ontouchmove(ev);
    this._togglePlayModeButton.ontouchmove(ev);
    this._playBlobManager.ontouchmove(ev);
  };
  public ontouchend = (ev: TouchEvent) => {
    this._initEjectArea.ontouchend(ev);
    this._togglePlayModeButton.ontouchend(ev);
    this._playBlobManager.ontouchend(ev);
  };
  // private _blobs
  // private _initEjectedBlobs

  // private getBlob() {
  //   return blob
  // }

  private onEjectInitBlob = (ev: GesturesAreaSwipeEvent) => {
    this._ejectedBlobManager.add(ev.endPoint.x, ev.endPoint.y);
    // this._ejectedBlobManager.add(200, 300);
  };

  public renderFrame = (time: number) => {
    drawPolygon(this._ctx, this._initEjectArea.polygon.hull, {
      fillStyle: "#f00",
    });

    const ctx = this._ctx;
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    // this._startArea.renderFrame(time)
    // this._startArea.onTouch = () => {
    //   // 发射blob
    //   const blob = new EjectOutBlob({ id: 'id', onEejectedEnd: () => {
    //     this._initEjectedBlobs.filter(blob)
    //     this._blobs.push(blob)
    //   }})
    //   this._initEjectedBlobs.push(blob)
    // }
    // this._blobs.forEach(blob => {
    //   blob.renderFrame(time)
    // })s
    // this._initEjectedBlobs.forEach(blob => {
    //   blob.renderFrame(time)
    // })
    this._playBlobManager.draw(this._ctx, this.SCALE_FACTOR);
    this._ejectedBlobManager.draw(this._ctx, this.SCALE_FACTOR);
    this._togglePlayModeButton.draw(
      this._ctx,
      this.SCALE_FACTOR,
      this._playBlobManager.playmode === PlayMode.joint ? "#f00" : "#000"
    );
    // ctx.rect()
  };
}
