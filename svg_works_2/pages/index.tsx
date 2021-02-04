import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
function Component() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/production");
  }, []);
  return null;
}
const index = React.memo(Component);
export default index;
