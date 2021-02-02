import React from "react";
import ProdutionMatrix from ".";
import ProductMatrixV2 from "./index_v2";
function Component() {
  return (
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
  );
}
const ProductionMatrixBlock = React.memo(Component);
export default ProductionMatrixBlock;
