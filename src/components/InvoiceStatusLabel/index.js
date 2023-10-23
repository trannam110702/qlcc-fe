import React from "react";
import InvoiceStatusWrapper from "./style";
import { Tag } from "antd";
const InvoiceStatusLabel = ({ status }) => {
  let text, color;
  switch (status) {
    case "new":
      text = "Mới";
      color = "green";
      break;
    case "pending":
      text = "Chờ xác nhận";
      color = "#ad8b00";
      break;
    case "success":
      text = "Đã thanh toán";
      color = "blue";
      break;
    default:
      text = "";
      color = "green";
  }
  return <Tag color={color}>{text}</Tag>;
};

export default InvoiceStatusLabel;
