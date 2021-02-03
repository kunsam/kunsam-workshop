import React, { useEffect, useRef } from "react";
import { hoverEffect } from "../../library/effect/hover";
import Link from "next/link";
import styles from "./index.module.scss";

interface Props {}

const HoverBackground: React.FC<{ style: React.CSSProperties }> = React.memo(
  function ({ style }) {
    const animationHover = useRef<any>();
    const container = useRef<any>();
    useEffect(() => {
      animationHover.current = new hoverEffect({
        parent: container.current,
        image1: "/images/bg-1.jpg",
        image2: "/images/bg-2.jpg",
        displacementImage: "/images/bg-3.jpg",
        intensity: 2,
        speedIn: 1,
        speedOut: 1,
      });
      //   console.log(animationHover, "container");
      animationHover.current.animate();
    }, []);

    return <div ref={container} style={style}></div>;
  }
);

function Component({}: Props) {
  return (
    <section
      style={{
        paddingTop: 50,
        height: 600,
        position: "relative",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div>
        <HoverBackground
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            height: "max-content",
            flexFlow: "row wrap",
            marginLeft: "30%",
          }}
        >
          <h1 style={{ color: "#fff", zIndex: 1, flex: "1 0 100%;" }}>
            我是个人前端设计师Sam
          </h1>
          <Link href="/contact">
            <h2
              className={styles.h2text}
              style={{ color: "#fff", zIndex: 1, flex: "1 0 100%;" }}
            >
              联系我
            </h2>
          </Link>

          <Link href="/about">
            <h2 style={{ color: "#fff", zIndex: 1, flex: "1 0 100%;" }}>
              关于我
            </h2>
          </Link>
        </div>
      </div>
    </section>
  );
}
const ContactUs: React.FC<Props> = React.memo(Component);
export default ContactUs;
