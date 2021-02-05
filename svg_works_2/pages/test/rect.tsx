import React from "react";
function Component() {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div style={{ display: "flex", height: 200 }}>
        <div style={{ width: "50%", height: 200, background: "#ff0e0e" }}></div>
        <div style={{ width: "50%", height: 200, background: "#f0e0e0" }}></div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 210,
          right: 0,
          width: 50,
          height: 50,zIndex: 10,
          backgroundColor: "turquoise",
        }}
      >
        <span>重置</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 260,
          right: 0,
          width: 50,
          height: 50,
          backgroundColor: "blueviolet",
        }}
      >
        <span>确认</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 350,
          right: 0,
          width: 50,
          height: 50,
          backgroundColor: "wheat",
        }}
      >
        <span>合成</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 400,
          right: 0,
          width: 50,
          height: 50,
          backgroundColor: "yellowgreen",
        }}
      >
        <span>切分</span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 300,
          backgroundColor: "blanchedalmond",
          opacity: 0.5,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 50,
          height: 200,
          backgroundColor: "blanchedalmond",
        }}
      >
        <span>点击</span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 50,
          height: 200,
          backgroundColor: "brown",
        }}
      >
        <span>扔掉</span>
      </div>
    </div>
  );
}
const rect = React.memo(Component);
export default rect;
