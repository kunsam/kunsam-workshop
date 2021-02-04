import React from "react";
import ParallaxCard from "../../../components/parallax_card";
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
            label1="课程"
            label2="展示"
            transformScrollYUp={scrollRange[0]}
            transformScrollYBottom={scrollRange[1]}
          />
        </div>

        <h2 style={{ color: "#fff", fontSize: 14, marginLeft: 20 }}>
          可交互的web ppt，更生动直观的展示课程总结
        </h2>
      </div>

      <div style={{ marginTop: 30 }}>
        <ParallaxCard
          imageUrl="/images/Back-to-School-PowerPoint-1-1280x720.jpg"
          scrollYUp={scrollRange[0]}
          scrollYBottom={scrollRange[1]}
        />
      </div>
    </div>
  );
}
const OrbitSection1: React.FC<Props> = React.memo(Component);
export default OrbitSection1;
