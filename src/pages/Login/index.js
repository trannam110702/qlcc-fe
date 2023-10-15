import React, { useState, useContext } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import background from "../../assets/images/background.jpg";
import HongKong from "../../assets/images/hongkong.jpg";
import favicon from "../../assets/images/logo.png";
import LoginWrrapper from "./style";

import { AuthContext } from "../../hooks/useAuth";
import { MessageContext } from "../../store/MessageContext";
import { authApi } from "../../api/qlccApi";
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const { notifiApi } = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  const onFinish = async ({ username, password }) => {
    try {
      setLoading(true);
      const res = await authApi.signIn(username, password);
      console.log(res);
      if (res.data && res.status === 200 && res.data.uuid && res.data.type) {
        login({ userId: res.data.uuid, accountType: res.data.type });
        notifiApi.success({
          message: `Đăng nhập thành công!`,
          description: "Chào mừng trở lại!",
          placement: "bottomRight",
        });
      } else if (res.data === "fail") {
        notifiApi.error({
          message: `Sai tài khoản hoặc mật khẩu`,
          description: "Tài khoản hoặc mật khẩu không đúng!",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notifiApi.error({
        message: `Lỗi server`,
        description: "Không thể kết nối!",
        placement: "bottomRight",
      });
    }
    setLoading(false);
  };

  return (
    <LoginWrrapper style={{ backgroundImage: `url(${background})` }}>
      <div className="modal">
        <div className="main">
          <img src={HongKong} alt="hongkong" className="sideimg"></img>
          <Form
            layout="vertical"
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div className="title">
              <img src={favicon} alt="logo"></img>
              Đăng nhập
            </div>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </LoginWrrapper>
  );
};

export default LoginPage;
