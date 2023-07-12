/* eslint-disable */

import { HiX } from "react-icons/hi";
// import Links from "./components/Links";\
import SidebarLinks from "./SidebarLinks";
// import routes from "../../routes";
import { useTranslation } from "react-i18next";

import Dashboard from "../../views/Dashboard";
import Request from "../../views/Request";
import Profile from "../../views/Profile";
import {
  MdHome,
  MdOutlineShoppingCart,
  // MdBarChart,
  MdPerson,
  // MdLock,
} from "react-icons/md";

const Sidebar = ({ open, onClose }) => {
  const { t } = useTranslation();
  const routes = [
    {
      name: t('sidebar.dashboard'),
      path: "dashboard",
      icon: <MdHome className="h-6 w-6" />,
      component: <Dashboard />,
    },
    {
      name: t('sidebar.request'),
      path: "request",
      icon: <MdOutlineShoppingCart className="h-6 w-6" />,
      component: <Request />,
    },
    {
      name: t('sidebar.profile'),
      path: "profile",
      icon: <MdPerson className="h-6 w-6" />,
      component: <Profile />,
    }
  ];

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 block cursor-pointer end-4 xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 h-2.5 font-poppins text-[20px] font-bold uppercase text-navy-700 ms-1 dark:text-white">
          { t('sidebar.title') }
        </div>
      </div>
      <div class="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <SidebarLinks routes={routes} />
      </ul>
      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
