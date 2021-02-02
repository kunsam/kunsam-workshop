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
            label1="品牌"
            label2="营销"
            transformScrollYUp={scrollRange[0]}
            transformScrollYBottom={scrollRange[1]}
          />
        </div>

        <h2 style={{ color: "#fff", fontSize: 14, marginLeft: 20 }}>
          装点互联网门面，传播品牌故事
        </h2>
      </div>

      <div style={{ marginTop: 30 }}>
        <ParallaxCard scrollYUp={scrollRange[0]} scrollYBottom={scrollRange[1]}>
          <video autoPlay loop src="/video/pi2.mp4" style={{ height: 300, width: 400 }} />
        </ParallaxCard>
      </div>
    </div>
  );
}
const OrbitSection5: React.FC<Props> = React.memo(Component);
export default OrbitSection5;
