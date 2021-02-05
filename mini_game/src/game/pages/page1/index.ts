import GamePage from "../../page";
import GAME_ALL_PAGE_KEYS from "../all_page_key";

export default class GamePage1 extends GamePage {
  public id = GAME_ALL_PAGE_KEYS.page1;

  public renderFrame = () => {
    const ctx = this._ctx;
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = "blue";
    ctx.stroke();
  };
}
