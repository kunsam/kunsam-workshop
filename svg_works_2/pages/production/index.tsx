import React, { PureComponent } from "react";
import FirstScreenSection from "../../src/blocks/first_screen";
import OrbitSection from "../../src/blocks/orbit_section";
import ProductionMatrixBlock from "../../src/components/production_matrix/block";

export default class index extends PureComponent {
  render() {
    return (
      <div>
        <FirstScreenSection />
        <OrbitSection />
        <ProductionMatrixBlock />
        <section style={{ height: 400, backgroundColor: "#fff" }}></section>
      </div>
    );
  }
}
