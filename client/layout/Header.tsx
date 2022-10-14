import React from "react";
// import style from "../styles/header.module.css"
import { Button } from 'antd';
import Nav from "../components/Menu";
import { Breadcrumb, Layout, Menu } from 'antd';
import { CSSProperties } from "styled-components";
const { Sider } = Layout;

interface HeaderProps {
  onChange : (e : any) => void
}

const Header = ({onChange} : HeaderProps) => {
  const styles : CSSProperties  = {
    backgroundColor : "#001529",
    color : '#fff'
  }
  return (
    <Sider style={styles} width={260}>
      <div>logo</div>
      <Nav onChange={onChange} />
    </Sider>
  )
};

export default Header;
