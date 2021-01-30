import React, { PropsWithChildren, useEffect, useState } from "react";
import { throttle } from "lodash";
interface Size {
  width: number;
  height: number;
}
interface Props {
  domId?: string;
  children: (props: Size) => React.ReactNode;
}

function Component({ domId, children }: Props) {
  const [size, setsize] = useState<Size>();
  useEffect(() => {
    if (domId) {
      const setNewSize = () => {
        const element = document.getElementById(domId);
        if (element) {
          setsize({ width: element.clientWidth, height: element.clientHeight });
        }
      };
      setNewSize();
      const element = document.getElementById(domId);
      if (element) {
        let handler = throttle(() => {
          setNewSize();
        }, 500);
        window.addEventListener("resize", handler);
        return () => {
          window.removeEventListener("resize", handler);
        };
      }
    } else {
      const setNewSize = () => {
        setsize({ width: window.innerWidth, height: window.innerHeight });
      };
      setNewSize();
      let handler = throttle(() => {
        setNewSize();
      }, 500);
      window.addEventListener("resize", handler);
      return () => {
        window.removeEventListener("resize", handler);
      };
    }
  }, []);

  if (!size) {
    return null;
  }
  return <>{children(size)}</>;
}
const AutoResizer: React.FC<Props> = React.memo(Component);
export default AutoResizer;
