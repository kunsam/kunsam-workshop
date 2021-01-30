import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";

export interface GlobalContextInterface {
  relativeUnit: number;
  themeColor: string;
}

export const GlobalContext = React.createContext<GlobalContextInterface>({
  relativeUnit: 667,
  themeColor: "#2c367c",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/style/global.css" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
        />
      </Head>
      <GlobalContext.Provider
        value={{
          relativeUnit: 667,
          themeColor: "#2c367c",
        }}
      >
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;
