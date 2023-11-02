import React from "react";
import InvoiceStatusWrapper from "./style";
import { Tag } from "antd";
const FeedbackStatusLabel = ({ status }) => {
  let text, color;
  switch (status) {
    case "pending":
      text = "Chưa xử lý";
      color = "red";
      break;
    case "fulfill":
      text = "Đã xử lý";
      color = "blue";
      break;
    default:
      text = "";
      color = "green";
  }
  return <Tag color={color}>{text}</Tag>;
};

export default FeedbackStatusLabel;
