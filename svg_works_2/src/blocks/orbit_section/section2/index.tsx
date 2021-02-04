import React from "react";
import ParallaxCard from "../../../components/parallax_card";
import LabelText3D from "../3d_label_text";
import OrbitChartSection from "./chart_section";

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
            label1="会议"
            label2="报告"
            transformScrollYUp={scrollRange[0]}
            transformScrollYBottom={scrollRange[1]}
          />
        </div>

        <h2 style={{ color: "#fff", fontSize: 14, marginLeft: 20 }}>
          使用web图表展示研究成果
        </h2>
      </div>

      <div style={{ marginTop: 30, width: 450 }}>
        {/* <ParallaxCard scrollYUp={scrollRange[0]} scrollYBottom={scrollRange[1]}> */}
        <OrbitChartSection />
        {/* </ParallaxCard> */}
      </div>
    </div>
  );
}
const OrbitSection2: React.FC<Props> = React.memo(Component);
export default OrbitSection2;
