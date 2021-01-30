import React, { useContext, useEffect } from "react";
import { SVG } from "@svgdotjs/svg.js";
import { GlobalContext } from "./_app";
import { Vector2 } from "three";
import svgpath from "svgpath";
import {
  getBesizerApproCirclePath,
  getBesizerApproCircularArcPath,
  getCircleWithCubicBezierWithRadius,
} from "../src/geometry/bezier_circle";

function Component() {
  const context = useContext(GlobalContext);

  return (
    <div>
      <section style={{ height: 800 }}></section>
      <section
        style={{
          height: 686,
          position: "relative",
          overflow: "hidden",
          background: "#2c367c",
          fill: "#2c367c",
          margin: 0,
        }}
      >
        <h1
          style={{
            color: "rgb(128, 128, 128)",
            fontSize: "calc(14vmin + 16px)",
            position: "absolute",
            bottom: "0%",
            width: "66%",
            margin: 0,
          }}
        >
          Cons­truc­t&shy;ion
        </h1>
        <h2
          style={{
            color: "transparent",
            fontSize: "calc(14vmin + 16px)",
            WebkitTextStrokeWidth: 2,
            WebkitTextStrokeColor: "rgb(128, 128, 128)",
            position: "absolute",
            bottom: "0%",
            zIndex: 997,
            width: "66%",
            margin: 0,
          }}
        >
          Cons­truc­t&shy;ion
        </h2>
        <div
          style={{
            position: "absolute",
            overflow: "hidden",
            width: "100%",
            height: 686,
            clipPath: "inset(0 0 0 0)",
            top: 0,
          }}
        >
          <div
            id="svg-container"
            style={{ position: "fixed", top: 0, left: 0, width: "100%" }}
          ></div>
        </div>
      </section>
      <section style={{ height: 800 }}></section>
    </div>
  );
}
const index = React.memo(Component);
export default index;
