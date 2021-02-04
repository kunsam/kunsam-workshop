import React, { Component } from "react";
import ContactUsPage from "../src/blocks/contact_page";

export default class contact extends Component {
  render() {
    return (
      <div
        style={{
          background: "#000",
          minHeight: "100vh",
          minWidth: "100vw",
          paddingTop: 100,
        }}
      >
        <ContactUsPage />
      </div>
    );
  }
}
