import React, { useContext } from "react";
import { GlobalContext } from "../../../pages/_app";
import CircleSvg1 from "../circle_svg_1";
import styles from "./index.module.scss";

function Component() {
  const globalcontext = useContext(GlobalContext);
  return (
    <section
      id="section2"
      className="t_section"
      style={{
        width: "100vw",
        height: globalcontext.relativeUnit
      }}
    >
      {/* <h1 className={styles.h1title}>Cons­truc­tion</h1>
      <h2 className={styles.h2title}>Cons­truc­tion</h2> */}
      <div
        style={{
          position: "absolute",
          overflow: "hidden",
          width: "100%",
          height: globalcontext.relativeUnit,
          borderBottom: "1px solid #2c367c",
          clipPath: "inset(0 0 0 0)",
        }}
      >
        <div
          id="svg-container"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: globalcontext.relativeUnit,
          }}
        >
          <CircleSvg1 id="#svg-container" />
        </div>
      </div>
    </section>
  );
}
const TestSection = React.memo(Component);
export default TestSection;
