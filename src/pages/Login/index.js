import React, { useState, useContext } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import background from "../../assets/images/background.jpg";
import HongKong from "../../assets/images/hongkong.jpg";
import favicon from "../../assets/images/logo.jpg";
import LoginWrrapper from "./style";

import { AuthContext } from "../../hooks/useAuth";
import { authApi } from "../../api/qlccApi";
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const onFinish = async ({ username, password }) => {
    try {
      setLoading(true);
      const res = await authApi.signIn(username, password);
      if (res.data && res.status === 200) {
        login({ userId: res.data.id, accountType: res.data.type });
      }
    } catch (error) {}
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
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
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
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </LoginWrrapper>
  );
};

export default LoginPage;
