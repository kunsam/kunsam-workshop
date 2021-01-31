import React, { useContext, useEffect } from "react";
import { SVG } from "@svgdotjs/svg.js";
import { Vector2 } from "three";
import { GlobalContext } from "../../../pages/_app";
import { getBesizerApproCirclePath } from "../../geometry/bezier_circle";
import { getTwotangentialCirclesPath } from "../../geometry/combo_bezier_circle";

const X = 2000;
const Y = 2000;

function Component({ id }) {
  const context = useContext(GlobalContext);

  useEffect(() => {
    const origin = new Vector2(0, 0);
    const svg = SVG();
    const draw = svg.addTo(id).size("100%", "100%");
    draw.attr("viewBox", "-1000 -1000 2000 2000");

    const drawPoint = (point: Vector2, text?: string) => {
      draw.circle(20).fill("red").center(point.x, point.y).stroke({ width: 0 });
      if (text) {
        draw
          .text(function (add) {
            add.tspan(text).fill("#fff").stroke({ width: 1, color: "#fff" });
          })
          .x(point.x)
          .y(point.y)
          .font({ size: 40 });
      }
    };
    const group = draw.group();
    const centerCircle = draw.circle(60).center(origin.x, origin.y);
    centerCircle.attr("vector-effect", "non-scaling-stroke");
    group.add(centerCircle);

    const relativeOriginPoint = (x: number, y: number) =>
      origin.clone().add(new Vector2(x, y));

    const circleGroup1Path = getTwotangentialCirclesPath(
      { center: relativeOriginPoint(0, -30), radius: 60 },
      { center: relativeOriginPoint(-40, -30), radius: 100 },
      0
    );
    draw.path(circleGroup1Path).attr("vector-effect", "non-scaling-stroke");

    const circleGroup2Path = getTwotangentialCirclesPath(
      { center: relativeOriginPoint(-40, 70), radius: 200 },
      { center: relativeOriginPoint(140, 70), radius: 380 },
      180
    );
    draw.path(circleGroup2Path).attr("vector-effect", "non-scaling-stroke");

    const circleGroup3Path = getTwotangentialCirclesPath(
      { center: relativeOriginPoint(140, -290), radius: 740 },
      { center: relativeOriginPoint(-320, -290), radius: 1200 },
      0
    );
    draw.path(circleGroup3Path).attr("vector-effect", "non-scaling-stroke");

    const curve7 = draw
      .path(getBesizerApproCirclePath(1900, relativeOriginPoint(-320, 410)))
      .attr("vector-effect", "non-scaling-stroke");

    group.add(curve7);

    return () => {
      draw.clear();
      svg.remove();
    };
  }, []);
  return null;
}
const CircleSvg1: React.FC<{
  // width: number;
  // height: number;
  id: string;
}> = React.memo(Component);
export default CircleSvg1;
