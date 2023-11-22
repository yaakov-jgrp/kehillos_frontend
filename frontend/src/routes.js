import React from "react";

// Admin Imports
// import Dashboard from "./views/Dashboard";
import Request from "./views/Request";
import Emails from "./views/Emails";
import NetfreeIcon from './assets/netfree.svg';
import {
  MdHome,
  MdOutlineContactSupport,
  MdOutlineSettings,
  MdOutlineEmail
  // MdBarChart,
  // MdPerson,
  // MdLock,
} from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2"
import NetFree from "./views/NetFree";
import Clients from "./views/Clients";
import ClientDetails from "./views/ClientDetails";

const routes = [
  // {
  //   name: t('sidebar.dashboard'),
  //   path: "dashboard",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <Dashboard />,
  // },
  {
    name: t('sidebar.clients'),
    path: "clients",
    type: "menu",
    icon: <HiOutlineUserGroup className="h-6 w-6" />,
    component: <Clients />,
  },
  {
    name: t('clients.clientDetails'),
    path: "clients/:clientId",
    component: <ClientDetails />,
  },
  {
    name: t('clients.clientFormSettings'),
    path: "settings/formSettings",
    component: <ClientsForm />,
  },
  {
    name: t('sidebar.request'),
    path: "request",
    icon: <MdOutlineContactSupport className="h-6 w-6" />,
    component: <Request />,
  },
  {
    name: t('sidebar.netfree'),
    path: "settings/netfree",
    type: "menu",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <NetFree />,
  },
  {
    name: t('sidebar.emails'),
    path: "settings/emails",
    type: "menu",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <Emails />,
  },
  // {
  //   name: t('sidebar.profile'),
  //   path: "profile",
  //   icon: <MdPerson className="h-6 w-6" />,
  //   component: <Profile />,
  // }
];

export default routes;
