export default class GamePage {
  protected _ctx: CanvasRenderingContext2D;
  protected _canvas: HTMLCanvasElement;
  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this._ctx = ctx;
    this._canvas = canvas;
  }
  public id: string;
  public renderFrame: FrameRequestCallback;
  public reset() {}
}
