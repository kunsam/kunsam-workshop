import { findIndex, throttle } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

interface Props {
  baseZindex: number;
  containerStyle?: React.CSSProperties;
  childs: {
    destoryOnClose?: boolean;
    scrollRange: [number, number];
    content: React.ReactNode;
  }[];
  totalRange: [number, number];
}

function Component({ childs, containerStyle, baseZindex, totalRange }: Props) {
  // const [scrollY, setscrollY] = useState(0);
  const [activeIndex, setactiveIndex] = useState(null);
  const [disappear, setdisappear] = useState(false);

  const onScrollYChange = useCallback((nextY: number) => {
    if (nextY >= totalRange[1] || nextY < totalRange[0]) {
      setdisappear(true);
    } else {
      setdisappear(false);
    }
    const findActiveChilds = findIndex(
      childs,
      (child) => child.scrollRange[0] <= nextY && child.scrollRange[1] >= nextY
    );
    // console.log(nextY, "onScrollYChange");
    if (findActiveChilds >= 0) {
      setactiveIndex(findActiveChilds);
    } else {
      setactiveIndex(null);
    }
  }, []);

  useEffect(() => {
    const handler = throttle(() => {
      //   setscrollY(window.scrollY);
      onScrollYChange(window.scrollY);
    }, 100);
    window.addEventListener("scroll", handler);
    // setscrollY(window.scrollY);
    onScrollYChange(window.scrollY);
    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  if (disappear) {
    return null;
  }
  return (
    <div style={containerStyle}>
      {childs.map((child, childI) => {
        if (child.destoryOnClose) {
          if (childI !== activeIndex) {
            return null;
          }
        }
        return (
          <div
            key={childI}
            style={{
              position: "fixed",
              zIndex: baseZindex + childI + (childI === activeIndex ? 10 : 0),
              opacity: childI === activeIndex ? 1 : 0,
              transition: "all .3s ease",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {child.content}
          </div>
        );
      })}
    </div>
  );
}
const FixedHeroContainer: React.FC<Props> = React.memo(Component);
export default FixedHeroContainer;
