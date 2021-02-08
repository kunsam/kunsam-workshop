import game from "kunsam-mini-game";

function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  // const game = new Game();

  game.init(ctx, { width: canvas.clientWidth, height: canvas.clientHeight });

  function ontouchstart(ev: TouchEvent) {
    game.ontouchstart(ev);
  }
  function ontouchmove(ev: TouchEvent) {
    game.ontouchmove(ev);
  }
  function ontouchend(ev: TouchEvent) {
    game.ontouchend(ev);
  }

  canvas.addEventListener("touchstart", ontouchstart);
  canvas.addEventListener("touchmove", ontouchmove);
  canvas.addEventListener("touchend", ontouchend);
  function loop(time: number) {
    game.renderFrame(time);
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", main);
