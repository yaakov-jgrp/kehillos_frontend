import React from "react";

// Admin Imports
import Dashboard from "./views/Dashboard";
import Request from "./views/Request";
import {
  MdHome,
  MdOutlineShoppingCart,
  // MdBarChart,
  // MdPerson,
  // MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "dashboard",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "request",
    path: "request",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <Request />,
  }
];

export default routes;
