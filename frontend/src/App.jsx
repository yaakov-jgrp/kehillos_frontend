
import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import SignIn from "./views/auth/SignIn";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { DEFAULT_LANGUAGE } from "./constants";
import DefaultLayout from "./layout/DefaultLayout";
// import authService from "./services/auth";
import { ACCESS_TOKEN_KEY } from "./constants";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import ClientsForm from "./views/ClientsForm";
import RouteGuard from "./component/common/RouteGuard";

function App() {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();

  useEffect(() => {
    if (localStorage.getItem(DEFAULT_LANGUAGE)) {
      const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
      if (defaultLanguageValue === 'he') {
        document.body.dir = 'rtl'
        i18next.changeLanguage('he');
      } else {
        document.body.dir = 'ltr'
        i18next.changeLanguage('en');
      }
    } else {
      document.body.dir = 'rtl'
      i18next.changeLanguage('he');
    }
  }, [])


  const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

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
      path: "clients/:id",
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


  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route exact path="/signin" element={<SignIn />} />

            <Route element={<RouteGuard token={ACCESS_TOKEN_KEY} routeRedirect="/signin" />}>
              <Route path="/*" element={<Navigate to={routes[0].path} replace />} />
              {
                routes.map((prop, key) => {
                  return (
                    <Route path={`/${prop.path}`} element={<DefaultLayout route={prop}>{prop.component}</DefaultLayout>} key={key} />
                  );
                })
              }
            </Route>
          </Routes>
        </Router>
        <ToastContainer
          autoClose={2000}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
