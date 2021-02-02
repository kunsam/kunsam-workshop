import { throttle } from "lodash";
import React, { PropsWithChildren, useEffect, useState } from "react";

const PRODUCT_TEXTS = [
  {
    text: "h5制作",
    image: "/awesomeh5-1.jpg",
  },
  {
    text: "h5游戏",
    image: "/h5game.jpg",
  },
  {
    text: "h5-PPT",
    image: "/h5ppt.jpg",
  },
  {
    text: "电子相册",
    image: "/web_album.jpg",
  },
  {
    text: "官方网站",
    image: "/offsite.jpg",
  },
  {
    text: "定制网页",
    image: "/web-design.webp",
  },
  {
    text: "Web交互组件",
    image: "/ui-comp.png",
  },
  {
    text: "CRM管理后台",
    image: "/web-admin.jpg",
  },
];

const CellItem: React.FC<PropsWithChildren<any>> = React.memo(function ({
  children,
}) {
  return (
    <div
      style={{
        width: 250,
        height: 250,
        border: "1px solid #fff",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
});

function Component() {
  const [pageXY, setpageXY] = useState([]);
  useEffect(() => {
    const handler = throttle((ev: MouseEvent) => {
      setpageXY([ev.pageX, ev.pageY]);
    }, 10);
    window.addEventListener("mousemove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {PRODUCT_TEXTS.map((pro, proi) => {
          return (
            <CellItem key={`${proi}`}>
              <p style={{ color: "#fff", textAlign: "center" }}>{pro.text}</p>
              <div style={{ textAlign: "center" }}>
                <img src={`/products${pro.image}`} style={{ width: 150, maxHeight: 180 }} />
              </div>
            </CellItem>
          );
        })}
      </div>
    </div>
  );
}
const ProductMatrixV2 = React.memo(Component);
export default ProductMatrixV2;
