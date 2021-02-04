import React from "react";
import ProdutionMatrix from "../src/components/production_matrix";
import ProductMatrixV2 from "../src/components/production_matrix/index_v2";

function Component() {
  return (
    <div style={{ backgroundColor: "#000", height: "100vh" }}>
      <div
        style={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          clipPath: "inset(0 0 0 0)",
          backgroundColor: "#000",
        }}
      >
        <ProdutionMatrix />
        <ProductMatrixV2 />
      </div>
    </div>
  );
}
const ProductMatrix = React.memo(Component);
export default ProductMatrix;
