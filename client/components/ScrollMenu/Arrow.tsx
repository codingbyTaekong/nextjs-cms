import { faArrowLeft, faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { VisibilityContext } from "react-horizontal-scrolling-menu";
import styled from "styled-components";

const Left = styled.button`
  width: 40px;
  height: 40px;
  opacity: ${props => props.disabled ? 0 : 1};
  border-radius: 50%;
  border: 0;
  background-color: rgba(255,255,255, 0.7);
  position : absolute;
  left: 10px;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  cursor: pointer;
  display: ${props => props.disabled ? 'none' : 'inline-block'};
  &:hover {
    background-color: rgba(255,255,255, 0.9);
  }
`
const Right = styled.button`
  width: 40px;
  height: 40px;
  opacity: ${props => props.disabled ? 0 : 1};
  border-radius: 50%;
  border: 0;
  background-color: rgba(255,255,255, 0.7);
  position : absolute;
  right: 10px;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  cursor: pointer;
  display: ${props => props.disabled ? 'none' : 'inline-block'};
  &:hover {
    background-color: rgba(255,255,255, 0.9);
  }
`


function Arrow({
  children,
  disabled,
  onClick
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        right: "1%",
        opacity: disabled ? "0" : "1",
        userSelect: "none"
      }}
    >
      {children}
    </button>
  );
}

export function LeftArrow() {
  const {
    isFirstItemVisible,
    scrollPrev,
    visibleElements,
    initComplete
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleElements.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  return (
    <Left disabled={disabled} onClick={() => scrollPrev()}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Left>
  );
}

export function RightArrow() {
  const { isLastItemVisible, scrollNext, visibleElements } = React.useContext(
    VisibilityContext
  );

  // console.log({ isLastItemVisible });
  const [disabled, setDisabled] = React.useState(
    !visibleElements.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  return (
    <Right disabled={disabled} onClick={() => scrollNext()}>
      <FontAwesomeIcon icon={faArrowRight} />
    </Right>
  );
}
