import React from "react";

// Admin Imports
import Dashboard from "./views/Dashboard";
import Request from "./views/Request";
import Emails from "./views/Emails";
import {
  MdHome,
  MdOutlineContactSupport,
  // MdBarChart,
  // MdPerson,
  // MdLock,
  MdOutlineSettings
  MdOutlineEmail
} from "react-icons/md";
import NetFree from "./views/NetFree";

const routes = [
  {
    name: "dashboard",
    path: "dashboard",
    type: "menu",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "requests",
    path: "requests",
    type: "menu",
    icon: <MdOutlineContactSupport className="h-6 w-6" />,
    component: <Request />,
  },
  {
    name: 'settings',
    type: 'top-menu',
    icon: <MdOutlineSettings className="h-6 w-6" />,
    children: [
      {
        name: "netfree",
        path: "settings/netfree",
        type: "menu",
        icon: <MdOutlineContactSupport className="h-6 w-6" />,
        component: <NetFree />,
      },
      {
        name: "emails",
        path: "settings/emails",
        type: "menu",
        icon: <MdOutlineEmail className="h-6 w-6" />,
        component: <Emails />,
      },
      {
        name: "goto",
        path: "settings/goto",
        type: "menu",
        icon: <MdOutlineEmail className="h-6 w-6" />,
        component: <Emails />,
      },
    ]
  }
];

export default routes;
