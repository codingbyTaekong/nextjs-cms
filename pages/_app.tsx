import '../styles/globals.css'
import Head from "next/head";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from 'next/app'
import "antd/dist/antd.css";
import useVH from 'react-vh';

function MyApp({ Component, pageProps }: AppProps) {
  useVH();
  return <Component {...pageProps} />
}

export default MyApp
