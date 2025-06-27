// React imports
import React from "react";

// UI Components Imports
import Request from "./views/Request";
import Emails from "./views/Emails";
import NetFree from "./views/NetFree";
import Clients from "./views/Clients";
import ClientDetails from "./views/ClientDetails";
import EmailTemplating from "./views/EmailTemplating";

// Icon imports
import { MdOutlineContactSupport, MdOutlineSettings } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import Config from "./views/apiConfig";
import { CgWebsite } from "react-icons/cg";
import OpenUrls from "./views/OpenUrls";

const routes = [
  {
    name: t("sidebar.clients"),
    path: "clients",
    type: "menu",
    icon: <HiOutlineUserGroup className="h-6 w-6" />,
    component: <Clients />,
  },
  {
    name: t("sidebar.openurls"),
    path: "openurls",
    type: "menu",
    icon: <CgWebsite className="h-6 w-6" />,
    component: <OpenUrls />,
  },
  {
    name: t("clients.clientDetails"),
    path: "clients/:clientId",
    component: <ClientDetails />,
  },
  {
    name: t("clients.clientFormSettings"),
    path: "settings/formSettings",
    component: <ClientsForm />,
  },
  {
    name: t("sidebar.request"),
    path: "request",
    icon: <MdOutlineContactSupport className="h-6 w-6" />,
    component: <Request />,
  },
  {
    name: t("sidebar.netfree"),
    path: "settings/netfree",
    type: "menu",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <NetFree />,
  },
  {
    name: t("sidebar.emails"),
    path: "settings/emails",
    type: "menu",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <Emails />,
  },
  {
    name: t("sidebar.templating"),
    path: "settings/emails/templating",
    type: "menu",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <EmailTemplating />,
  },
  // {
  //   name: t("sidebar.pdfs1"),
  //   path: "settings/pdfs1",
  //   type: "menu",
  //   icon: <MdEditDocument className="h-6 w-6" />,
  //   component: <PdfMe />,
  // },
  // {
  //   name: t("sidebar.pdfs2"),
  //   path: "settings/pdfs2",
  //   type: "menu",
  //   icon: <MdEditDocument className="h-6 w-6" />,
  //   component: <PdfUnlayer />,
  // },
  {
    name: t("sidebar.config"),
    path: "config",
    type: "menu",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <Config />,
  },

  // {
  //   name: t('sidebar.profile'),
  //   path: "profile",
  //   icon: <MdPerson className="h-6 w-6" />,
  //   component: <Profile />,
  // }
];

export default routes;
