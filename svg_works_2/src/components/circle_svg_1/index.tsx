import React, { useContext, useEffect } from "react";
import { SVG } from "@svgdotjs/svg.js";
import { Vector2 } from "three";
import { GlobalContext } from "../../../pages/_app";
import { getBesizerApproCirclePath } from "../../geometry/bezier_circle";
import { getDoubleBesizerCircleGroup } from "../../geometry/combo_bezier_circle";

const X = 2000;
const Y = 2000;

function Component({ id }) {
  const context = useContext(GlobalContext);

  useEffect(() => {
    const origin = new Vector2(0, 0);
    const svg = SVG();
    const draw = svg.addTo(id).size("100%", "100%");
    draw.attr("viewBox", "-1000 -1000 2000 2000");
    const drawPoint = (point: Vector2) => {
      draw.circle(10).fill("red").center(point.x, point.y);
    };
    const group = draw.group();
    const centerCircle = draw
      .circle(60)
      // .fill(context.themeColor)
      .center(origin.x, origin.y);
    centerCircle.attr("vector-effect", "non-scaling-stroke");
    group.add(centerCircle);
    const relativeOriginPoint = (x: number, y: number) =>
      origin.clone().add(new Vector2(x, y));

    const c_group_1 = getDoubleBesizerCircleGroup(
      { center: relativeOriginPoint(0, -30), radius: 60 },
      { center: relativeOriginPoint(-40, -30), radius: 100 }
    );

    draw.path(c_group_1);

    const curve1 = draw
      .path(getBesizerApproCirclePath(60, relativeOriginPoint(0, -30)))
      .attr("vector-effect", "non-scaling-stroke")
      .hide();
    // .fill("none")
    // .stroke({ color: context.themeColor, width: 1 });
    group.add(curve1);
    const curve2 = draw
      .path(getBesizerApproCirclePath(100, relativeOriginPoint(-40, -30)))
      .attr("vector-effect", "non-scaling-stroke")
      .hide();
    // .fill("none")
    // .stroke({ color: context.themeColor, width: 1 });
    group.add(curve2);
    const curve3 = draw
      .path(getBesizerApproCirclePath(200, relativeOriginPoint(-40, 70)))
      .attr("vector-effect", "non-scaling-stroke")
      .hide();
    // .fill("none")
    // .stroke({ color: context.themeColor, width: 1 });
    group.add(curve3);
    const curve4 = draw
      .path(getBesizerApproCirclePath(380, relativeOriginPoint(140, 70)))
      .attr("vector-effect", "non-scaling-stroke")
      .hide();
    // .fill("none")
    // .stroke({ color: context.themeColor, width: 1 });
    group.add(curve4);

    const curve5 = draw
      .path(getBesizerApproCirclePath(740, relativeOriginPoint(140, -290)))
      .attr("vector-effect", "non-scaling-stroke")
      .hide();
    // .fill("none")
    // .stroke({ color: context.themeColor, width: 1 });
    group.add(curve5);

    const curve6 = draw
      .path(getBesizerApproCirclePath(1200, relativeOriginPoint(-320, -290)))
      .attr("vector-effect", "non-scaling-stroke")
      .hide();
    // .fill("none")
    // .stroke({ color: context.themeColor, width: 1 });
    group.add(curve6);

    const curve7 = draw
      .path(getBesizerApproCirclePath(1900, relativeOriginPoint(-320, 410)))
      .attr("vector-effect", "non-scaling-stroke")
      .hide();
    // .fill("none")
    // .stroke({ color: context.themeColor, width: 1 });
    group.add(curve7);

    const widthCenter = new Vector2().subVectors(
      new Vector2(X / 2, origin.y),
      origin
    );

    // group.translate(widthCenter.x + 200, widthCenter.y);
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
