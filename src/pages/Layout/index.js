import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  IdcardOutlined,
  PayCircleOutlined,
  StockOutlined,
  SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/images/logowhite.png";
import { Layout, Menu } from "antd";
import LayoutWrapper from "./style";
import { AuthContext } from "../../hooks/useAuth";
import { authApi } from "../../api/qlccApi";
import useLocalStorage from "../../hooks/useLocalStorage";
const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const adminItems = [
  getItem("Quản Lý Phòng", "room-sub", <HomeOutlined />, [
    getItem("Phòng", "room"),
    getItem("Loại Phòng", "roomtype"),
  ]),
  getItem("Quản lý dịch vụ", "service", <BookOutlined />, [
    getItem("Bảng giá dịch vụ", "service-price"),
    getItem("Cập nhật chỉ số", "service-index", <></>, [
      getItem("Điện", "service/electric"),
      getItem("Nước", "service/water"),
      getItem("Giặt là", "service/laundry"),
    ]),
  ]),
  getItem("Quản lý cư dân", "resident", <IdcardOutlined />),
  getItem("Hợp đồng thuê", "contract", <TeamOutlined />),
  getItem("Quản lý hóa đơn", "invoice", <PayCircleOutlined />, [
    getItem("Tạo hóa đơn hàng tháng", "invoice/create"),
    getItem("Hóa đơn", "invoice"),
  ]),
  getItem("Thống kê", "statistics", <StockOutlined />),
  getItem("Quản lý tài khoản", "accounts", <SettingOutlined />),
];
const residentItems = [
  getItem("Hóa đơn", "invoice", <PayCircleOutlined />),
  getItem("Phản hồi & Kiến nghị", "feed-back", <TeamOutlined />),
  getItem("Quản lý tài khoản", "account", <SettingOutlined />),
];
const MainLayout = ({ children }) => {
  let items;
  const navigate = useNavigate();
  const [accountType] = useLocalStorage("accountType");
  const { logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [logOutSpin, setLogOutSpin] = useState(false);
  const logOut = async () => {
    try {
      setLogOutSpin(true);
      await authApi.logOut();
    } catch (error) {
    } finally {
      logout();
      setLogOutSpin(false);
    }
  };
  const menuOnClick = ({ key }) => {
    return navigate(key);
  };
  switch (accountType) {
    case "admin":
      items = adminItems;
      break;
    case "resident":
      items = residentItems;
      break;
    default:
      break;
  }
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
                  <li onClick={logOut} className="logout">
                    <span>Đăng xuất </span>
                    <LoadingOutlined
                      className="logout-spin"
                      style={{ display: logOutSpin ? "block" : "none" }}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Header>
        <Layout>
          <Sider
            width={250}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical" />
            <Menu
              mode="inline"
              items={items}
              onClick={menuOnClick}
              style={{ overflowY: "auto", height: "100%" }}
            />
          </Sider>
          <Content className="content">{children}</Content>
        </Layout>
      </Layout>
    </LayoutWrapper>
  );
};

export default MainLayout;
