import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { MenuItem } from "./side-menu.data";
import { SideMenuProps } from "../../screens/main.props";

export const SideMenu = ({
  handleScreenChange,
}: SideMenuProps): JSX.Element => {
  const menuItems: MenuItem[] = [{ icon: HomeOutlined, label: "Home" }];

  const items: MenuProps["items"] = menuItems.map((item, index) => ({
    key: String(index + 1),
    icon: React.createElement(item.icon),
    label: item.label,
  }));

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100%",
        position: "fixed",
      }}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
        }}
      />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={items}
        defaultActiveFirst={true}
        onClick={(item): void => {
          handleScreenChange(
            (menuItems.at(parseInt(item.key, 10) - 1) as MenuItem).label
          );
        }}
      />
    </Sider>
  );
};
