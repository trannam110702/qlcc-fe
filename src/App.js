import "./App.css";
import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import AntdThemeCustom from "./store/AntdThemeCustom";

function App() {
  return (
    <AntdThemeCustom>
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    </AntdThemeCustom>
  );
}

export default App;
