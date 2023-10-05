import React, { useState } from "react";
import {
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  IdcardOutlined,
  PayCircleOutlined,
  StockOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/images/logo.jpg";
import { Layout, Menu } from "antd";
import LayoutWrapper from "./style";
const { Header, Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Quản Lý Phòng", "room-sub", <HomeOutlined />, [
    getItem("Phòng", "room"),
    getItem("Loại Phòng", "room-type"),
  ]),
  getItem("Quản lý dịch vụ", "service-sub", <BookOutlined />, [
    getItem("Bảng giá dịch vụ", "service-price"),
    getItem("Cập nhật chỉ số", "service-index", <></>, [
      getItem("Điện", "electric"),
      getItem("Nước", "water"),
      getItem("Giặt là", "laundry"),
      getItem("Gửi xe", "parking"),
    ]),
  ]),
  getItem("Quản lý cư dân", "resident", <IdcardOutlined />),
  getItem("Hợp đồng thuê", "contract", <TeamOutlined />),
  getItem("Hóa đơn", "invoice", <PayCircleOutlined />),
  getItem("Thống kê", "statistics", <StockOutlined />),
  getItem("Quản lý tài khoản", "account", <SettingOutlined />),
];
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <LayoutWrapper>
      <Layout className="main-layout">
        <Header className="header">
          <img src={Logo} alt="" className="logo"></img>
          <div className="nav">
            <div className="account">
              <UserOutlined />
              <div className="dropdown">
                <ul>
                  <li>Thông tin tài khoản</li>
                  <li>Đăng xuất</li>
                </ul>
              </div>
            </div>
          </div>
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical" />
            <Menu theme="dark" mode="inline" items={items} />
          </Sider>
          <Content></Content>
        </Layout>
      </Layout>
    </LayoutWrapper>
  );
};

export default MainLayout;
