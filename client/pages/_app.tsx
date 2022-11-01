import '../styles/globals.css'
import Head from "next/head";
import "react-quill/dist/quill.snow.css";
// import type { AppProps } from 'next/app'
import "antd/dist/antd.css";
import useVH from 'react-vh';
import { ThemeProvider } from "styled-components";
import { theme } from '../styles/theme';
import { GlobalStyle } from '../styles/global-style';
import { compose, createStore, Store } from "redux";
import rootReducer from '../redux';
import { Provider } from 'react-redux'
import App, { AppContext, AppProps } from 'next/app'
declare global {
  interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// store 생성
function configureStore():Store {
  const composeEnhancers = typeof (window as any) !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
      rootReducer,
      composeEnhancers()
  );
  return store;
}

const store = configureStore();


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
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
    </>
  )
}

export default MyApp

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {...appProps}
}
