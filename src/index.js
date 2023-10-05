import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: window.localStorage.getItem("token") ? (
      <Navigate to="/dashboard" />
    ) : (
      <Login />
    ),
    errorElement: <Navigate to="/" replace={true} />,
  },
  {
    path: "/dashboard",
    element: <App />,
    errorElement: <Navigate to="/dashboard" replace={true} />,
    children: [
      {
        index: true,
        element: <Rooms />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
