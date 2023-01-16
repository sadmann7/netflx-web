import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import "../styles/globals.css";

// imports: components, contexts
import DefaultLayout from "@/components/layout/DefaultLayout";
import ToastWrapper from "@/components/ToastWrapper";
import { AuthProvider } from "@/contexts/AuthProvider";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <AuthProvider>
      <Head>
        <title>Netflx</title>
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <ToastWrapper />
    </AuthProvider>
  );
}

export default MyApp;
