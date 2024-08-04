// UI Components Imports
import SidebarLinks from "./SidebarLinks";
import Request from "../../views/Request";
import Emails from "../../views/Emails";
import NetFree from "../../views/NetFree";
import Clients from "../../views/Clients";
import ClientsForm from "../../views/ClientsForm";
import Logs from "../..//views/Logs";
import Users from "../../views/Users";

// Third-party Imports
import { useTranslation } from "react-i18next";

// Icon imports
import FormsSvg from "../../assets/forms.svg";
import { HiX } from "react-icons/hi";
import {
  MdOutlineContactSupport,
  MdOutlineEmail,
  MdLogout,
  MdOutlineSettings,
} from "react-icons/md";
import { IoLogoBuffer } from "react-icons/io";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import NetfreeIcon from "../../constants/icons/NetfreeIcon";
import Logo from "../../assets/images/Kehillos_Logo.svg";
import FormsIcon from "../../assets/images/forms.svg";
import FormsDarkIcon from "../../assets/images/forms_dark.svg";
import ClientFormsTable from "../../views/ClientFormsTable";

const Sidebar = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const routes = [
    {
      name: t("sidebar.clients"),
      path: "clients",
      type: "menu",
      icon: <HiOutlineUserGroup className="h-6 w-6" />,
      component: <Clients />,
    },
    {
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
    },
    {
      name: t("sidebar.request"),
      path: "request",
      type: "menu",
      icon: <MdOutlineContactSupport className="h-6 w-6" />,
      component: <Request />,
    },
    {
      name: t("sidebar.settings"),
      type: "top-menu",
      icon: <MdOutlineSettings className="h-6 w-6" />,
      children: [
        {
          name: t("sidebar.formCreation"),
          path: "settings/forms",
          type: "menu",
          icon: <img src={FormsSvg} className="h-5 w-5" />,
          component: <ClientsForm />,
        },
        {
          name: t("sidebar.clients"),
          path: "settings/formSettings",
          type: "menu",
          icon: <HiOutlineUserGroup className="h-6 w-6" />,
          component: <ClientsForm />,
        },
        {
          name: t("sidebar.users"),
          path: "settings/users",
          type: "menu",
          icon: <HiOutlineUsers className="h-6 w-6" />,
          component: <Users />,
        },
        {
          name: t("sidebar.netfree"),
          path: "settings/netfree",
          type: "menu",
          icon: <NetfreeIcon className="h-6 w-6" />,
          component: <NetFree />,
        },
        {
          name: t("sidebar.emails"),
          path: "settings/emails",
          type: "menu",
          icon: <MdOutlineEmail className="h-6 w-6" />,
          component: <Emails />,
        },
        {
          name: t("sidebar.logs"),
          path: "settings/logs",
          type: "menu",
          icon: <IoLogoBuffer className="h-6 w-6" />,
          component: <Logs />,
        },
      ],
    },
    {
      name: t("sidebar.logout"),
      path: "profile",
      type: "button",
      icon: <MdLogout className="h-6 w-6" />,
    },
  ];

  return (
    <div
      className={`h-full px-5 sm:none duration-175 w-[250px] fixed linear !z-50 flex flex-col bg-white pb-10 shadow-custom transition-all md:!z-50 lg:!z-50 xl:!z-0 ${
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
        <img src={Logo} alt="Logo" className="h-[44px] md:h-[65px]" />
      </div>

      <ul className="mb-auto pt-1">
        <SidebarLinks routes={routes} />
      </ul>

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
