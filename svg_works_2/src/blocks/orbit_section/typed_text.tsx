import { throttle } from "lodash";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import classnames from "classnames";

function Component() {
  const [scrollY, setscrollY] = useState(0);
  useEffect(() => {
    const handler = throttle(() => {
      setscrollY(window.scrollY);
    }, 100);
    document.addEventListener("scroll", handler);
    return () => {
      document.removeEventListener("scroll", handler);
    };
  }, []);
  console.log(scrollY, "scrollY");
  return (
    <div
      className={classnames(
        styles.OrbitSection,
        (scrollY < 300 || scrollY > 800) && styles.OrbitSectionDisable
      )}
    >
      <div className="card">
        <h1>
          <span className="enclosed">课程</span>展示
        </h1>
      </div>
    </div>
  );
}

const OrbitSectionTypedText = React.memo(Component);
export default OrbitSectionTypedText;
