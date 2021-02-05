import GamePage from "./page";
import GamePage1 from "./pages/page1";
import GamePage2 from "./pages/page2";

export default class Game {
  public pagesMap: Map<string, GamePage> = new Map();
  public currentPageKey: string = "";
  public currentPage: GamePage;

  private _ctx: CanvasRenderingContext2D;
  private _canvasSize: { width: number; height: number };
  public init(
    ctx: CanvasRenderingContext2D,
    canvasSize: { width: number; height: number }
  ) {
    this._ctx = ctx;
    this._canvasSize = canvasSize;
    const gamepage1 = new GamePage1(ctx);
    this.pagesMap.set(gamepage1.id, gamepage1);

    const gamepage2 = new GamePage2(ctx);
    this.pagesMap.set(gamepage2.id, gamepage2);

    this.changePage(gamepage1.id);
    setTimeout(() => {
      this.changePage(gamepage2.id);
    }, 3000);
  }

  public clearFrame() {
    this._ctx.clearRect(0, 0, this._canvasSize.width, this._canvasSize.height);
  }

  public renderFrame: FrameRequestCallback = (time) => {
    console.log(this.currentPageKey, time, "renderFrame");
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

  public ontouchstart(ev: TouchEvent) {
    if (this.currentPage) {
      this.currentPage.ontouchstart(ev);
    }
  }

  public ontouchmove(ev: TouchEvent) {
    if (this.currentPage) {
      this.currentPage.ontouchmove(ev);
    }
  }

  public ontouchend(ev: TouchEvent) {
    if (this.currentPage) {
      this.currentPage.ontouchend(ev);
    }
  }
}
