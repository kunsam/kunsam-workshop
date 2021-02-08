import React, { Component } from "react";
import Game from "../../src/game/game";

export default class canvas extends Component {
  componentDidMount() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const game = new Game();
    game.init(ctx, { width: canvas.clientWidth, height: canvas.clientHeight });
  }

  //   function loop(time: number) {
  //     game.renderFrame(time);
  //     window.requestAnimationFrame(loop);
  //   }
  //   window.requestAnimationFrame(loop);

  //   render() {
  //     return (
  //       <canvas id="canvas" style={{ height: "100vh", width: "100vw" }}></canvas>
  //     );
  //   }
}
