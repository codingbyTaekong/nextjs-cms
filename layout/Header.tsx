import React from "react";
// import style from "../styles/header.module.css"
import { Button } from 'antd';
import Nav from "../components/Menu";
import { Breadcrumb, Layout, Menu } from 'antd';
const { Sider } = Layout;


const Header = () => {
  return (
    <Sider style={{backgroundColor : "#fff"}} width={260}>
      <div>logo</div>
      <Nav />
    </Sider>
  )
};

export default Header;
