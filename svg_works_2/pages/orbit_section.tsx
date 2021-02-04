import React from "react";
import OrbitSection from "../src/blocks/orbit_section";
function Component() {
  return (
    <div>
      <OrbitSection />
    </div>
  );
}
const orbit_section = React.memo(Component);
export default orbit_section;
