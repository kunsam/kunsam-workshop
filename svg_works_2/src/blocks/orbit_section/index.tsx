import React, { useEffect } from "react";
import styles from "./index.module.scss";
import { SVG } from "@svgdotjs/svg.js";
import FixedHeroContainer from "./hero_container";
import LabelText3D from "./3d_label_text";
import OrbitSection1 from "./section1";
import OrbitSection2 from "./section2";
import OrbitSection3 from "./section3";
import OrbitSection4 from "./section4";
import OrbitSection5 from "./section5";

const SCROLL_RANGE_CONFIG: { [key: string]: [number, number] } = {
  section1: [300, 900],
  section2: [1000, 1600],
  section3: [1750, 2400],
  section4: [2500, 3200],
  section5: [3300, 4000],
};

function Component() {
  useEffect(() => {
    // const initScrollY = 177; // 这个得外面传进来
    const svg = SVG();
    const draw = svg.addTo("#orbit_section-svg-container").size("100%", "100%");
    svg.addClass(styles.Svg).id("orbiters");
    draw.attr("viewBox", "00 1000 2000 7000");
    const initY = 1050;
    draw
      .circle(86 * 2)
      .center(2000, initY + 86)
      .attr("vector-effect", "non-scaling-stroke");
    draw
      .circle(361 * 2)
      .center(2000, initY + 361)
      .attr("vector-effect", "non-scaling-stroke");
    draw
      .circle(518 * 2)
      .center(2000, initY + 518)
      .attr("vector-effect", "non-scaling-stroke");
    draw
      .circle(661 * 2)
      .center(2000, initY + 661)
      .attr("vector-effect", "non-scaling-stroke");
    draw
      .circle(2927 * 2)
      .center(2000, initY + 2927)
      .attr("vector-effect", "non-scaling-stroke");
    draw
      .circle(1087 * 2)
      .center(2000, initY + 1087)
      .attr("vector-effect", "non-scaling-stroke");
    draw
      .circle(1548 * 2)
      .center(2000, initY + 1548)
      .attr("vector-effect", "non-scaling-stroke");
    draw
      .circle(3153 * 2)
      .center(2000, initY + 3153)
      .attr("vector-effect", "non-scaling-stroke");

    const rect = draw
      .rect(2000)
      .attr({ height: "100%" })
      .attr("vector-effect", "non-scaling-stroke")
      .x(0)
      .y(initY)
      .fill("#000")
      .stroke("none");

    const orbitsGroup = draw.group();
    orbitsGroup.add(
      draw
        .circle(86 * 2)
        .center(2000, initY + 86)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.add(
      draw
        .circle(361 * 2)
        .center(2000, initY + 361)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.add(
      draw
        .circle(518 * 2)
        .center(2000, initY + 518)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.add(
      draw
        .circle(661 * 2)
        .center(2000, initY + 661)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.add(
      draw
        .circle(2927 * 2)
        .center(2000, initY + 2927)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.add(
      draw
        .circle(1087 * 2)
        .center(2000, initY + 1087)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.add(
      draw
        .circle(1548 * 2)
        .center(2000, initY + 1548)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.add(
      draw
        .circle(3153 * 2)
        .center(2000, initY + 3153)
        .attr("vector-effect", "non-scaling-stroke")
    );
    orbitsGroup.attr({ style: "opacity: 0.33" });

    draw
      .circle(4 * 2)
      .center(-100, initY)
      .attr("vector-effect", "non-scaling-stroke");

    let scaler: HTMLElement;

    const ratio = 7000 / document.getElementById("orbiters").clientHeight;

    let handler = () => {
      // setscrollY(window.scrollY);
      if (!scaler) {
        scaler = document.getElementById("orbit_section-svg-container");
      }
      // console.log(window.scrollY, ratio, scaler.offsetTop, "scrollYscrollY");
      var dist =
        initY +
        (window.scrollY - scaler.offsetTop - window.innerHeight / 2) * ratio;
      rect.y(dist);
    };

    document.addEventListener("scroll", handler);
    // setscrollY(window.scrollY);
    return () => {
      draw.clear();
      svg.remove();
      document.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.innercontainer}>
        <div id="orbit_section-svg-container"></div>
      </div>

      <FixedHeroContainer
        totalRange={[500, 5000]}
        baseZindex={1}
        childs={[
          {
            scrollRange: SCROLL_RANGE_CONFIG.section1,
            content: (
              <OrbitSection1 scrollRange={SCROLL_RANGE_CONFIG.section1} />
            ),
          },
          {
            scrollRange: SCROLL_RANGE_CONFIG.section2,
            content: (
              <OrbitSection2 scrollRange={SCROLL_RANGE_CONFIG.section2} />
            ),
          },
          {
            scrollRange: SCROLL_RANGE_CONFIG.section3,
            destoryOnClose: true,
            content: (
              <OrbitSection3 scrollRange={SCROLL_RANGE_CONFIG.section3} />
            ),
          },
          {
            scrollRange: SCROLL_RANGE_CONFIG.section4,
            content: (
              <OrbitSection4 scrollRange={SCROLL_RANGE_CONFIG.section4} />
            ),
          },
          {
            scrollRange: SCROLL_RANGE_CONFIG.section5,
            content: (
              <OrbitSection5 scrollRange={SCROLL_RANGE_CONFIG.section5} />
            ),
          },
        ]}
      />
    </section>
  );
}
const OrbitSection = React.memo(Component);
export default OrbitSection;
