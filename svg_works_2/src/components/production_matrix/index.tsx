import { throttle } from "lodash";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
function Component() {
  const [pageXY, setpageXY] = useState([]);
  useEffect(() => {
    const handler = throttle((ev: MouseEvent) => {
      setpageXY([ev.clientX, ev.clientY]);
    }, 10);
    window.addEventListener("mousemove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
    };
  }, []);
  return (
    <div className={styles.ProdutionMatrix}>
      <div className="lines">
        <div className="horizontals">
          <div className="horizontal animated"></div>
          <div className="horizontal animated"></div>
          <div className="horizontal animated"></div>
          <div className="horizontal animated"></div>
        </div>
        <div className="verticals">
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
        </div>
      </div>
      <div
        className="lines yellow"
        style={{
          clipPath:
            pageXY.length === 0
              ? ""
              : `circle(4.16667vw at ${pageXY[0]}px ${pageXY[1]}px)`,
        }}
      >
        <div className="horizontals">
          <div className="horizontal animated"></div>
          <div className="horizontal animated"></div>
          <div className="horizontal animated"></div>
          <div className="horizontal animated"></div>
        </div>
        <div className="verticals">
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
          <div className="vertical animated"></div>
        </div>
      </div>
    </div>
  );
}
const ProdutionMatrix = React.memo(Component);
export default ProdutionMatrix;
