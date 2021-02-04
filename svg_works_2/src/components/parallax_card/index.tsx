import { throttle } from "lodash";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "./index.module.scss";
interface Props {
  imageUrl?: string;
  scrollYUp: number;
  scrollYBottom: number;
}
function Component({
  scrollYUp,
  scrollYBottom,
  imageUrl,
  children,
}: PropsWithChildren<Props>) {
  const [cardTransform, setcardTransform] = useState("");
  const setTranform = useCallback((x: number, y: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let force = 80,
      rx = (x / width) * force,
      ry = (y / height) * -force;
    setcardTransform("rotateY(" + rx + "deg) rotateX(" + ry + "deg)");
  }, []);

  useEffect(() => {
    const shandler = throttle(() => {
      if (window.scrollY < scrollYUp || window.scrollY > scrollYBottom) {
        setTranform(0, 0);
      } else {
        setTranform(
          -284,
          -150 +
            (window.scrollY - scrollYUp) * (300 / (scrollYBottom - scrollYUp))
        );
      }
    }, 100);

    let handler = throttle((event) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let x = event.clientX - width / 2,
        y = event.clientY - height / 2;
      // console.log(x, y, "mousemove");
      setTranform(x, y);
    }, 100);

    // window.addEventListener("scroll", shandler);
    window.addEventListener("mousemove", handler);
    setTranform(0, 0);
    return () => {
      // window.removeEventListener("scroll", shandler);
      window.removeEventListener("mousemove", handler);
    };
  }, []);

  return (
    <div className={styles.P3DCard}>
      <div
        className="card"
        style={{
          transform: cardTransform,
          backgroundImage: imageUrl ? `url(${imageUrl})` : "",
        }}
      >
        {children}
      </div>
    </div>
  );
}
const ParallaxCard: React.FC<Props> = React.memo(Component);
export default ParallaxCard;
