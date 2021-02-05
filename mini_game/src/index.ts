import Game from "./game/game";
import { dotetst } from "./test";

dotetst();

function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  let ctx = canvas.getContext("2d");

  const game = new Game();
  game.init(ctx, canvas);

  function loop(time: number) {
    game.renderFrame(time);
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", main);
