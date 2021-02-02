import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import classnames from "classnames";
import { throttle } from "lodash";

interface Props {
  label1: string;
  label2: string;
  transformScrollYUp: number;
  transformScrollYBottom: number;
}
function Component({
  label1,
  label2,
  transformScrollYUp,
  transformScrollYBottom,
}: Props) {
  const [scrollY, setscrollY] = useState(0);
  useEffect(() => {
    const handler = throttle(() => {
      setscrollY(window.scrollY);
    }, 100);
    document.addEventListener("scroll", handler);
    setscrollY(window.scrollY);
    return () => {
      document.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <div
      className={classnames(
        styles.LabelText3D,
        (scrollY < transformScrollYUp || scrollY > transformScrollYBottom) &&
          styles.LabelText3DDisable
      )}
    >
      <div className="card">
        <h1>
          <span className="enclosed">{label1}</span>
          {label2}
        </h1>
      </div>
    </div>
  );
}
const LabelText3D: React.FC<Props> = React.memo(Component);
export default LabelText3D;
