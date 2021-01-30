import React, { useContext, useEffect, useState } from "react";
import AutoResizer from "../src/components/auto_resizer";
import CircleSvg1 from "../src/components/circle_svg_1";
import TestSection from "../src/components/test_section";
import { GlobalContext } from "./_app";

const Resizer: React.FC = React.memo(function () {
  const [size, setsize] = useState();

  useEffect(() => {}, []);

  return <div></div>;
});

function Component() {
  const [height, setheight] = useState(667);
  const globalcontext = useContext(GlobalContext);
  return (
    <div>
      <section style={{ height: 200 }}></section>

      <TestSection />

      <section style={{ height: 500 }}></section>
    </div>
  );
}
const T = React.memo(Component);
export default T;
