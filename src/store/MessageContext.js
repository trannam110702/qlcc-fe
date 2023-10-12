import React, { createContext } from "react";
import { message, notification } from "antd";

export const MessageContext = createContext();

const MessageContextProvider = ({ children }) => {
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [notifiApi, contextNotificationHolder] = notification.useNotification();
  return (
    <MessageContext.Provider value={{ messageApi, notifiApi }}>
      {contextNotificationHolder}
      {contextMessageHolder}
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;
