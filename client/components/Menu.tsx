import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { CSSProperties } from "styled-components";


function getItem(
  label: string,
  key: string,
  icon?: any,
  children?: Array<any>,
  type?: any
) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
    //1 뎁스
  getItem("대시보드", "sub1", <BarChartOutlined />),
  // 2, 3뎁스
  getItem("공지사항", "sub2", <AppstoreOutlined />, [
    getItem("목록", "5"),
    getItem("글쓰기", "notice_board"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),
  ]),
  getItem("Navigation Three", "sub4", <SettingOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),
];
const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

interface HeaderProps {
  onChange : (e : any) => void
}

function Nav({onChange} : HeaderProps) {
  const [openKeys, setOpenKeys] = useState(["sub1"]);

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (
      typeof latestOpenKey === "string" &&
      rootSubmenuKeys.indexOf(latestOpenKey) === -1
    ) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const onClickMenu = (e : any) => {
    // console.log(e);
    onChange(e);
    // e.keyPath를 통해 페이지 이동시켜야함
  };

  const styles : CSSProperties  = {
    // backgroundColor : "#041C32",
    // color : '#fff'
  }
  return (
    <Menu
      theme="dark"
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      items={items}
      onClick={onClickMenu}
      className="menu----my"
      style={styles}
    />
  );
}

export default Nav;
