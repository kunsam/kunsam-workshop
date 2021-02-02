import React, { useEffect, useRef } from "react";
import { hoverEffect } from "../src/library/effect/hover";

function Component() {
  const animationHover = useRef<any>();
  const container = useRef<any>();
  useEffect(() => {
    animationHover.current = new hoverEffect({
      parent: container.current,
      image1: "/images/c11112.jpeg",
      image2: "/images/small.jpg",
      displacementImage: "/images/small.jpg",
      intensity: 2,
      speedIn: 1,
      speedOut: 1,
    });
    console.log(animationHover, "container");
    animationHover.current.animate();
  }, []);

  return (
    <div ref={container} style={{ width: "100vw", height: "100vh" }}></div>
  );
}
const HoverEffect = React.memo(Component);
export default HoverEffect;
