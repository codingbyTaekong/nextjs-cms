import React from "react";
// import style from "../styles/header.module.css"
import { Button } from 'antd';
import Nav from "../components/Menu";
import { Breadcrumb, Layout, Menu } from 'antd';
const { Sider } = Layout;

interface HeaderProps {
  onChange : (e : any) => void
}

const Header = ({onChange} : HeaderProps) => {
  return (
    <Sider style={{backgroundColor : "#fff"}} width={260}>
      <div>logo</div>
      <Nav onChange={onChange} />
    </Sider>
  )
};

export default Header;
