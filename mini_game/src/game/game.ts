import GamePage from "./page";
import GamePage1 from "./pages/page1";
import GamePage2 from "./pages/page2";

export default class Game {
  public pagesMap: Map<string, GamePage> = new Map();
  public currentPageKey: string = "";
  public currentPage: GamePage;

  private _ctx: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;
  public init(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this._ctx = ctx;
    this._canvas = canvas;

    const gamepage1 = new GamePage1(ctx, canvas);
    this.pagesMap.set(gamepage1.id, gamepage1);

    const gamepage2 = new GamePage2(ctx, canvas);
    this.pagesMap.set(gamepage2.id, gamepage2);

    this.changePage(gamepage1.id);
    setTimeout(() => {
      this.changePage(gamepage2.id);
    }, 3000);
  }

  public clearFrame() {
    this._ctx.clearRect(
      0,
      0,
      this._canvas.clientWidth,
      this._canvas.clientHeight
    );
  }

  public renderFrame: FrameRequestCallback = (time) => {
    console.log(this.currentPageKey, "renderFrame, ");
    this.clearFrame();
    if (this.currentPage) {
      this.currentPage.renderFrame(time);
    }
  };

  public changePage(key: string) {
    this.currentPageKey = key;
    if (this.currentPage) {
      this.currentPage.reset();
    }
    this.currentPage = this.pagesMap.get(key);
  }
}
