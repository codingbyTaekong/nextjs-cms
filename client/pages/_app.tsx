import '../styles/globals.css'
import Head from "next/head";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from 'next/app'
import "antd/dist/antd.css";
import useVH from 'react-vh';
import { ThemeProvider } from "styled-components";
import { theme } from '../styles/theme';
import { GlobalStyle } from '../styles/global-style';
function MyApp({ Component, pageProps }: AppProps) {
  useVH();
  return (
    <>
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>boilerplate</title>
    </Head>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
    </>
  )
}

export default MyApp
