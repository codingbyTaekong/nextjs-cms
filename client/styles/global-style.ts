import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

export const GlobalStyle = createGlobalStyle`
    ${reset}
    * {
    box-sizing: border-box;
    }

    html,
    body,
    #__next {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    /* -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; */
    overflow: hidden;
    }

    body {
    position: fixed;
    overflow: hidden;
    overscroll-behavior-y: none;
    font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
    }

    .flex {
    display: flex;
    }

    .fixed {
    position: fixed;
    }

    .relative {
    position: relative;
    }

    .absolute {
    position: absolute;
    }


    :focus {
        outline: none;
        border: none;
    }
    :root {
        --bs-color-blue : #04293A;
    }
`;
