import { GameGeometry } from "./typings/game_geometry";

export default class GamePage {
  protected _ctx: CanvasRenderingContext2D;
  protected canvasSize: GameGeometry.IVector2;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvasSize: GameGeometry.IVector2
  ) {
    this._ctx = ctx;
    this.canvasSize = canvasSize;
  }
  public id: string;
  public renderFrame: FrameRequestCallback;
  public reset() {}
  public ontouchstart: (ev: TouchEvent) => void;
  public ontouchmove: (ev: TouchEvent) => void;
  public ontouchend: (ev: TouchEvent) => void;
}
