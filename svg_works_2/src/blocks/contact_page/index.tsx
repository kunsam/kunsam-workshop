import Head from "next/head";
import React from "react";

function Component() {
  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        padding: 50,
        boxShadow: "1px 1px 10px 5px #3b3939 inset",
        position: "relative",
      }}
    >
      <Head>
        <link rel="stylesheet" href="/style/contact_page.css" />
      </Head>
      <h1 className="animate-text">联系方式</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 50 }}>
        <div>
          <h1 style={{ color: "#fff" }}>邮箱: kunsam624@icloud.com</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <img src="/images/wechat.jpg" style={{ width: 100 }} />
              <h2 style={{ color: "#fff", textAlign: "center" }}>微信</h2>
            </div>
            <div style={{ marginLeft: 50 }}>
              <img src="/images/whatsapp.png" style={{ width: 100 }} />
              <h2 style={{ color: "#fff", textAlign: "center" }}>whatsApp</h2>
            </div>
          </div>
        </div>
        <div>
          <img src="/images/people-model.png" style={{ width: 250 }} />
        </div>
      </div>
    </div>
  );
}
const ContactUsPage = React.memo(Component);
export default ContactUsPage;
