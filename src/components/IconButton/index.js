import React from "react";
import IconButtonWrapper from "./style";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const IconType = ({ type, onclick }) => {
  switch (type) {
    case "edit":
      return (
        <div style={{ color: "#FED766" }}>
          <EditOutlined />
        </div>
      );
    case "delete":
      return (
        <div style={{ color: "red" }}>
          <DeleteOutlined />
        </div>
      );
    default:
      return <></>;
  }
};
const IconButton = ({ type, onclick }) => {
  return (
    <IconButtonWrapper onClick={onclick ? onclick : () => {}}>
      <IconType type={type} />
    </IconButtonWrapper>
  );
};
export default IconButton;
