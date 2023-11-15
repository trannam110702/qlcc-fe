import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import "./index.css";

import App from "./App";
import Rooms from "./pages/Rooms";
import RoomType from "./pages/RoomType";
import Residents from "./pages/Resident";
import Contract from "./pages/Contract";
import ServiceIndex from "./pages/ServiceIndex";
import ServicePrice from "./pages/ServicePrice";
import Invoice from "./pages/Invoice";
import CreateInvoice from "./pages/CreateInvoice";
import AccountsManagement from "./pages/AccountsManagement";
import Purchase from "./pages/Purchase";
import InvoiceResident from "./pages/InvoiceResident";
import Feedback from "./pages/Feedback";
import FeedbackManager from "./pages/FeedbackManager";
import Statistics from "./pages/Statistics";
import TotalStatistics from "./pages/Statistics/TotalStatistics";
import ServiceStatistics from "./pages/Statistics/ServiceStatistics";
import CombineStatistics from "./pages/Statistics/CombineStatistics";
import Welcome from "./pages/Welcome";

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
        path: "purchase",
        element: <Purchase />,
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
        path: "resident-invoice",
        element: <InvoiceResident />,
      },
      {
        path: "invoice/create",
        element: <CreateInvoice />,
      },
      {
        path: "accounts",
        element: <AccountsManagement />,
      },
      {
        path: "feed-back",
        element: <Feedback />,
      },
      {
        path: "feedback-manager",
        element: <FeedbackManager />,
      },
      {
        path: "statistics",
        element: <Statistics />,
        children: [
          {
            path: "room",
            element: <TotalStatistics />,
          },
          {
            path: "service",
            element: <ServiceStatistics />,
          },
          {
            path: "combine",
            element: <CombineStatistics />,
          },
        ],
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
