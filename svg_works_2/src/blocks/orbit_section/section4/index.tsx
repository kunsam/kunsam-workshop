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
            label1="节日"
            label2="纪念"
            transformScrollYUp={scrollRange[0]}
            transformScrollYBottom={scrollRange[1]}
          />
        </div>

        <h2 style={{ color: "#fff", fontSize: 14, marginLeft: 20 }}>
          制作电子相册，让美好更易分享
        </h2>
      </div>

      <div style={{ marginTop: 30 }}>
        <ParallaxCard
          scrollYUp={scrollRange[0]}
          scrollYBottom={scrollRange[1]}
          imageUrl="/images/960x960_album-photo-naissance-rosemood@2x.jpg"
        ></ParallaxCard>
      </div>
    </div>
  );
}
const OrbitSection4: React.FC<Props> = React.memo(Component);
export default OrbitSection4;
