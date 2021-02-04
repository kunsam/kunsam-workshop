import React from "react";
import ParallaxCard from "../../../components/parallax_card";
import OrbitSection3DModel from "../3dmodel_section";
import LabelText3D from "../3d_label_text";
interface Props {
  scrollRange: [number, number];
}
function Component({ scrollRange }: Props) {
  return (
    <div
      style={{
        padding: 40,
        borderRadius: 16,
        border: "1px solid #fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "inline-block", width: 100, height: 50 }}>
          <LabelText3D
            label1="产品"
            label2="宣传"
            transformScrollYUp={scrollRange[0]}
            transformScrollYBottom={scrollRange[1]}
          />
        </div>

        <h2 style={{ color: "#fff", fontSize: 14, marginLeft: 20 }}>
          使用3D渲染，客户与产品进行互动
        </h2>
      </div>

      <div style={{ marginTop: 30 }}>
        {/* <ParallaxCard scrollYUp={scrollRange[0]} scrollYBottom={scrollRange[1]}> */}
        <OrbitSection3DModel />
        {/* </ParallaxCard> */}
      </div>
      <p style={{ fontSize: 12, color: "#FFF" }}>*可用鼠标拖拽3D模型</p>
    </div>
  );
}
const OrbitSection3: React.FC<Props> = React.memo(Component);
export default OrbitSection3;
