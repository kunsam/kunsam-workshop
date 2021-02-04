import React, { useEffect, useRef } from "react";
import { Chart } from "@antv/g2";
import { CHART_SECTION_MOCK_DATA } from "./data";

function Component() {
  const ref = useRef(null);
  useEffect(() => {
    const COLOR = ["#1890FF", "#2FC25B", "#FACC14"];
    const data = CHART_SECTION_MOCK_DATA;
    const chart = new Chart({
      container: ref.current,
      autoFit: true,
      height: 500,
      padding: 48,
    });
    chart.data(data);

    chart.scale({
      carat: {
        sync: true,
      },
      price: {
        sync: true,
      },
      cut: {
        sync: true,
      },
    });

    chart.facet("list", {
      fields: ["cut"],
      cols: 3, // 超过3个换行
      padding: 30,
      eachView(view) {
        view
          .point()
          .position("carat*price")
          .color("cut")
          .shape("circle")
          .style({ fillOpacity: 0.3, stroke: null })
          .size(3);
      },
    });
    chart.render();
  }, []);
  return (
    <div
      ref={ref}
      id="ChartSection"
      style={{ height: 300, backgroundColor: "#fff" }}
    ></div>
  );
}
const OrbitChartSection = React.memo(Component);
export default OrbitChartSection;
