import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AuthProvider from "./hooks/useAuth";
import "./index.css";
import App from "./App";
import Welcome from "./pages/Welcome";
import Rooms from "./pages/Rooms";
import RoomType from "./pages/RoomType";
import Residents from "./pages/Resident";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    errorElement: <Navigate to="/" replace={true} />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: "roomtype",
        element: <RoomType />,
      },
      {
        path: "room",
        element: <Rooms />,
      },
      {
        path: "resident",
        element: <Residents />,
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
