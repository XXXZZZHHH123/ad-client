import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const NavBar = () => {
  return (
    <>
      <div
        className="logo"
        style={{
          float: "left",
          width: "120px",
          height: "31px",
          margin: "16px 24px 16px 0",
          background: "rgba(255, 255, 255, 0.2)",
        }}
      />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<DollarOutlined />}>
          <Link to="/budgetset">BudgetSet</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<LogoutOutlined />}>
          <Link to="/logout">Logout</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default NavBar;
