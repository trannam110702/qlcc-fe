import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./index.css";

import Login from "./pages/Login";

import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <Navigate to="/" replace={true} />,
  },
  {
    path: "/dashboard",
    element: <App />,
    errorElement: <Navigate to="/dashboard" replace={true} />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
