import game from "kunsam-mini-game";

function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  let ctx = canvas.getContext("2d");

  console.log(game, "game2");
  // const game = new Game();
  game.init(ctx, { width: canvas.clientWidth, height: canvas.clientHeight });

  function ontouchstart(ev: TouchEvent) {
    game.ontouchstart;
  }
  canvas.addEventListener("touchstart", ontouchstart);
  function loop(time: number) {
    game.renderFrame(time);
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", main);
