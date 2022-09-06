import Input from "antd/lib/input/Input";
import react, { useState, useMemo, useCallback, memo } from "react";
import styled from "styled-components";
import Editor from "../components/Editor";

const Container= styled.div`
  padding-top: 100px;
  width: 100%;
  /* background-color: #fff; */
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* PC , 테블릿 가로 (해상도 768px ~ 1023px)*/ 
  @media all and (min-width:768px) and (max-width:1023px) { 
    padding: 0 10%;
  } 

  /* 테블릿 세로 (해상도 768px ~ 1023px)*/ 
  @media all and (min-width:768px) and (max-width:1023px) { 
    padding: 0 5%;
  } 

  /* 모바일 가로, 테블릿 세로 (해상도 480px ~ 767px)*/ 
  @media all and (min-width:480px) and (max-width:767px) {
  } 

  /* 모바일 가로, 테블릿 세로 (해상도 ~ 479px)*/ 
  @media all and (max-width:479px) {

  }
`

const TopContainer = styled.div`
  width: calc(100% - 260px);
  height: 45px;
  right: 0;
  position: fixed;
  background-color: var(--bs-color-blue);
`

const NoticeBoard = () => {
  return (
    <>
      <TopContainer></TopContainer>
      <Container>
        <Input style={{maxWidth : '1024px'}} placeholder="제목을 입력하세요" />
        <Editor />
      </Container>
    </>
  )
};

export default NoticeBoard;
