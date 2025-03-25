import React, { useContext } from "react";
import SidebarLinks from "./SidebarLinks";
import Request from "../../views/Request";
import Emails from "../../views/Emails";
import NetFree from "../../views/NetFree";
import Clients from "../../views/Clients";
import ClientsForm from "../../views/ClientsForm";
import Logs from "../../views/Logs";
import Users from "../../views/Users";
import { useTranslation } from "react-i18next";
import FormsSvg from "../../assets/forms.svg";
import { HiX } from "react-icons/hi";
import {
  MdOutlineContactSupport,
  MdOutlineEmail,
  MdLogout,
  MdOutlineSettings,
  MdEditDocument,
} from "react-icons/md";
import { IoLogoBuffer } from "react-icons/io";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import NetfreeIcon from "../../constants/icons/NetfreeIcon";
import Logo from "../../assets/images/Kehillos_Logo.svg";
import FormsIcon from "../../assets/images/forms.svg";
import FormsDarkIcon from "../../assets/images/forms_dark.svg";
import ClientFormsTable from "../../views/ClientFormsTable";
import Config from "../../views/apiConfig";
import { USER_DETAILS } from "../../constants";
import { UserContext } from "../../Hooks/permissionContext";
import PdfMe from "../../views/PdfMe";
import PdfUnlayer from "../../views/PdfUnlayer";

const Sidebar = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const permissionsObjects =
    JSON.parse(localStorage.getItem("permissionsObjects")) || {};
  const { userDetails, permissions } = useContext(UserContext);

  const routes = [
    permissions?.clientsPermission?.is_read || userDetails?.organization_admin
      ? {
          name: t("sidebar.clients"),
          path: "clients",
          type: "menu",
          icon: <HiOutlineUserGroup className="h-6 w-6" />,
          component: <Clients />,
        }
      : null,
    permissions?.formsPermission?.is_read || userDetails?.organization_admin
      ? {
          name: t("sidebar.forms"),
          path: "client-forms",
          type: "menu",
          icon: <img src={FormsIcon} alt="forms-icon" className="h-4 w-4" />,
          darkIcon: (
            <img
              src={FormsDarkIcon}
              alt="forms-dark-icon"
              className="h-6 w-6 -mt-4"
            />
          ),
          component: <ClientFormsTable />,
        }
      : null,
    permissions?.requestsPermission?.is_read || userDetails?.organization_admin
      ? {
          name: t("sidebar.request"),
          path: "request",
          type: "menu",
          icon: <MdOutlineContactSupport className="h-6 w-6" />,
          component: <Request />,
        }
      : null,
    permissions?.fieldconfigurationPermission?.is_read ||
    userDetails?.organization_admin
      ? {
          name: t("Field Configuration"),
          path: "config",
          type: "menu",
          icon: <IoLogoBuffer className="h-6 w-6" />,
          component: <Config />,
        }
      : null,
    {
      name: t("sidebar.settings"),
      type: "top-menu",
      icon: <MdOutlineSettings className="h-6 w-6" />,
      children: [
        permissions?.automationPermission?.is_read ||
        userDetails?.organization_admin
          ? {
              name: t("sidebar.automation"),
              path: "settings/automation",
              type: "menu",
              icon: <img src={FormsSvg} className="h-5 w-5" />,
              component: <ClientsForm />,
            }
          : null,
        permissions?.formcreationPermission?.is_read ||
        userDetails?.organization_admin
          ? {
              name: t("sidebar.formCreation"),
              path: "settings/forms",
              type: "menu",
              icon: <img src={FormsSvg} className="h-5 w-5" />,
              component: <ClientsForm />,
            }
          : null,
        permissions?.clientfieldsPermission?.is_read ||
        userDetails?.organization_admin
          ? {
              name: t("sidebar.clients"),
              path: "settings/formSettings",
              type: "menu",
              icon: <HiOutlineUserGroup className="h-6 w-6" />,
              component: <ClientsForm />,
            }
          : null,
        permissions?.usersPermission?.is_read || userDetails?.organization_admin
          ? {
              name: t("sidebar.users"),
              path: "settings/users",
              type: "menu",
              icon: <HiOutlineUsers className="h-6 w-6" />,
              component: <Users />,
            }
          : null,
        permissions?.netfreePermission?.is_read ||
        userDetails?.organization_admin
          ? {
              name: t("sidebar.netfree"),
              path: "settings/netfree",
              type: "menu",
              icon: <NetfreeIcon className="h-6 w-6" />,
              component: <NetFree />,
            }
          : null,
        permissions?.emailsPermission?.is_read ||
        userDetails?.organization_admin
          ? {
              name: t("sidebar.emails"),
              path: "settings/emails",
              type: "menu",
              icon: <MdOutlineEmail className="h-6 w-6" />,
              component: <Emails />,
            }
          : null,
        // permissions?.pdfsPermission?.is_read ||
        // userDetails?.organization_admin
        //   ? {
        //       name: t("sidebar.pdfs1"),
        //       path: "settings/pdfs1",
        //       type: "menu",
        //       icon: <MdEditDocument className="h-6 w-6" />,
        //       component: <PdfMe />,
        //     }
        //   : null,
        // permissions?.pdfsPermission?.is_read ||
        // userDetails?.organization_admin
        //   ? {
        //       name: t("sidebar.pdfs2"),
        //       path: "settings/pdfs2",
        //       type: "menu",
        //       icon: <MdEditDocument className="h-6 w-6" />,
        //       component: <PdfUnlayer />,
        //     }
        //   : null,
        permissions?.logshistoryPermission?.is_read ||
        userDetails?.organization_admin
          ? {
              name: t("sidebar.logs"),
              path: "settings/logs",
              type: "menu",
              icon: <IoLogoBuffer className="h-6 w-6" />,
              component: <Logs />,
            }
          : null,
      ].filter(Boolean),
    },
    {
      name: t("sidebar.logout"),
      path: "profile",
      type: "button",
      icon: <MdLogout className="h-6 w-6" />,
    },
  ].filter(Boolean);

  return (
    <div
      className={`h-full px-5 sm:none duration-175 w-[220px] fixed linear !z-50 flex flex-col bg-white pb-10 shadow-custom transition-all md:!z-50 lg:!z-50 xl:!z-0 ${
        open
          ? i18n.dir() === "ltr"
            ? `left-0`
            : "right-0"
          : i18n.dir() === "ltr"
          ? "-left-96"
          : "-right-96"
      }`}
    >
      <span
        className="absolute top-2 block cursor-pointer end-2 xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className="mx-auto my-6 flex items-center">
        <img
          src={localStorage.getItem("logo_url")}
          alt="Logo"
          className="h-[44px] md:h-[65px]"
        />
      </div>

      {/* Add this div to ensure the content can scroll */}
      <div className="flex-1 overflow-y-auto">
        <ul className="mb-auto pt-1">
          <SidebarLinks routes={routes} />
        </ul>
      </div>

      {/* Adding the new div with support information */}
      <div className="text-center mt-auto py-2">
        <p style={{ fontSize: "15px" }}>
          {" "}
          <a href="mailto:support@kehillos.com">support@kehillos.com</a>
        </p>
        <p style={{ fontSize: "12px", color: "#4597f7" }}>
          Powering tomorrow <a href="https://jgrp.dev">jgrp.dev</a>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
