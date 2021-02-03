import React, { PureComponent } from "react";
import ContactUs from "../../src/blocks/contact_us";
import FirstScreenSection from "../../src/blocks/first_screen";
import OrbitSection from "../../src/blocks/orbit_section";
import ProductionMatrixBlock from "../../src/components/production_matrix/block";

export default class index extends PureComponent {
  render() {
    return (
      <div>
        <FirstScreenSection />
        <OrbitSection />
        <div style={{ paddingTop: 100, background: "#000" }}>
          <ProductionMatrixBlock />
        </div>

        <ContactUs />
      </div>
    );
  }
}
