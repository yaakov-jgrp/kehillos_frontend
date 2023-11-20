import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../component/common/Sidebar';
// import Dashboard from '../views/Dashboard';
import { useTranslation } from "react-i18next";
import Navbar from '../component/common/Navbar';
import Request from '../views/Request';
// import Profile from '../views/Profile';
import Emails from '../views/Emails';
import AlertPopup from '../component/common/AlertPopup';
import {
  MdHome,
  MdOutlineContactSupport,
  MdPerson,
  MdOutlineSettings,
} from "react-icons/md";
import NetFree from '../views/NetFree';
import Clients from '../views/Clients';
import { HiOutlineUserGroup } from "react-icons/hi2"
import ClientsForm from '../views/ClientsForm';

const DefaultLayout = () => {

  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("");
  const [currentRouteName, setCurrentRouteName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

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

  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].path);
        setCurrentRouteName(routes[i].name);
        navigate(routes[i].path);
      }
    }
    if (currentRoute === "" || currentRouteName === "") {
      setCurrentRoute(routes[0].path);
      setCurrentRouteName(routes[0].name);
      navigate(routes[0].path);
    }
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route path={`/${prop.path}`} element={prop.component} key={key} />
      );
    });
  };

  return (
    <div className="flex gap-4 max-h-[100vh] md:overflow-y-hidden h-full w-full">
      <AlertPopup />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pe-2 ${i18n.dir() === 'rtl' ? 'xl:mr-[250px]' : 'xl:ml-[250px]'}`}
        >
          <div className="h-full md:h-[100vh]">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              brandName={currentRouteName}
              secondary={getActiveNavbar(routes)}
            />
            <div className={`pt-5s mx-auto mb-auto h-[calc(100%-100px)] p-2 md:pr-2 ${i18n.dir() === 'rtl' ? 'xl:mr-3' : 'xl:ml-3'}`}>
              <Routes>
                {getRoutes(routes)}
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DefaultLayout
