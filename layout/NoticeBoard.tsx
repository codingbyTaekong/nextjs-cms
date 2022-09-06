import react, { useState, useMemo, useCallback, memo } from "react";
import styled from "styled-components";
import Editor from "./Editor";

const Container= styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
`

const NoticeBoard = () => {
  return (
    <Container>
      <Editor />
    </Container>
  )
};

export default NoticeBoard;
