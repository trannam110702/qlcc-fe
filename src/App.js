import "./App.css";
import React from "react";
import { Outlet } from "react-router-dom";

import AuthProvider from "./hooks/useAuth";
import ProtectedRoute from "./pages/ProtectedRoute";
import AntdThemeCustom from "./store/AntdThemeCustom";
import MessageContextProvider from "./store/MessageContext";

function App() {
  return (
    <AuthProvider>
      <AntdThemeCustom>
        <MessageContextProvider>
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        </MessageContextProvider>
      </AntdThemeCustom>
    </AuthProvider>
  );
}

export default App;
