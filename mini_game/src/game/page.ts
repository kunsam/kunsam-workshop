export default class GamePage {
  protected _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }
  public id: string;
  public renderFrame: FrameRequestCallback;
  public reset() {}
}
