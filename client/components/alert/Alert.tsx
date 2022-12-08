import { faBadgeCheck, faExclamationCircle, faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import styled, {keyframes} from 'styled-components';

interface ContainerProps {
    type : "error" | "waring" | "success"
}

const animation = keyframes`
    0% {
        opacity: 0;
        transform: translate(-50%,-100%);
    }
    100% {
        opacity: 1;
        transform: translate(-50%,0);
    }
`
const Container = styled.div<ContainerProps>`
    position: fixed;
    z-index: 2;
    top: 0;
    left: 50%;
    transform: translate(-50%,-100%);
    opacity: 0;
    animation: ${animation} 1.5s forwards;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    color : #fff;
    /* background-color: aqua; */
    background-color: ${props => props.type === "error" ? '#f03e3e' : ''};
    background-color: ${props => props.type === "warning" ? '#f59f00' : ''};
    background-color: ${props => props.type === "success" ? '#15aabf' : ''};
    border-radius: 8px;
    & > span {
        font-size: 16px;
    }
    & > p {
        font-size: 16px;
        font-family: var(--fn-sans);
        font-weight: 500;
        margin-left: 5px;
    }
`

interface Props {
    text : string
    type : "error" | "warning" | "success" | null
    handler : () => void
}
function Alert({text, type, handler} : Props) {
  useEffect(()=> {
    setTimeout(()=> {
        handler()
    }, 3000)
  },[])
  return (
    <Container type={type}>
        {type === "error" && <FontAwesomeIcon icon={faExclamationCircle} />}
        {type === "warning" && <FontAwesomeIcon icon={faExclamationTriangle} />}
        {type === "success" && <FontAwesomeIcon icon={faBadgeCheck} />}
        <p>{text}</p>
    </Container>
  );
}

export default Alert;