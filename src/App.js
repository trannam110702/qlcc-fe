import "./App.css";
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

import { AuthContext } from "./hooks/useAuth";
import ProtectedRoute from "./pages/ProtectedRoute";


function App() {

  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default App;
