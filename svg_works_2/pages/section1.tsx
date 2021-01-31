import React from "react";
import FirstScreenSection from "../src/blocks/first_screen";
function Component() {
  return (
    <div>
      <FirstScreenSection />
    </div>
  );
}
const Section1Page = React.memo(Component);
export default Section1Page;
