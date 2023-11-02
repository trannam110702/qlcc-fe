import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Typography,
} from "antd";

import FeedbackWrapper from "./style";
import { AuthContext } from "../../hooks/useAuth";
import { MessageContext } from "../../store/MessageContext";
import { feedbackApi } from "../../api/residentApi";
import AntdSpin from "../../components/Spin";

const Feedback = () => {
  const [form] = Form.useForm();
  const { userData } = useContext(AuthContext);
  const { notifiApi } = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  return (
    <FeedbackWrapper>
      {!loading ? (
        <Form
          layout="vertical"
          style={{ maxWidth: "800px", margin: "0 auto" }}
          form={form}
        >
          <Typography.Title level={3} className="title">
            Tạo phản hồi
          </Typography.Title>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              {
                required: true,
              },
            ]}
            maxLength={255}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 6 }}
              maxLength={1000}
            />
          </Form.Item>
          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={async () => {
              try {
                await form.validateFields();
                setLoading(true);
                await feedbackApi.addFeedback({
                  title: form.getFieldValue("title"),
                  content: form.getFieldValue("content"),
                  resident_id: userData.resident_id,
                });
                notifiApi.success({
                  message: `Gửi phản hồi thành công!`,
                  description: "Hãy đợi ban quản trị phản hồi!",
                  placement: "bottomRight",
                });
              } catch (error) {
              } finally {
                setLoading(false);
              }
            }}
          >
            Gửi phản hồi
          </Button>
        </Form>
      ) : (
        <AntdSpin />
      )}
    </FeedbackWrapper>
  );
};
export default Feedback;
