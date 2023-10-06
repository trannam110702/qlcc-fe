import "./App.css";
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

import { AuthContext } from "./hooks/useAuth";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/Login";

function App() {
  const { userId, accountType } = useContext(AuthContext);
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default App;
