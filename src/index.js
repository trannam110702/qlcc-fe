import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import Welcome from "./pages/Welcome";
import Rooms from "./pages/Rooms";
import RoomType from "./pages/RoomType";
import Residents from "./pages/Resident";
import Contract from "./pages/Contract";
import ServiceIndex from "./pages/ServiceIndex";
import ServicePrice from "./pages/ServicePrice";
import Invoice from "./pages/Invoice";
import CreateInvoice from "./pages/CreateInvoice";
import AccountsManagement from "./pages/AccountsManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
      {
        path: "contract",
        element: <Contract />,
      },
      {
        path: "service/:type",
        element: <ServiceIndex />,
      },
      {
        path: "service-price",
        element: <ServicePrice />,
      },
      {
        path: "invoice",
        element: <Invoice />,
      },
      {
        path: "invoice/create",
        element: <CreateInvoice />,
      },
      {
        path: "accounts",
        element: <AccountsManagement />,
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
