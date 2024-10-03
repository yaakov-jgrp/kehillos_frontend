// React imports
import React, { useEffect, useMemo } from "react";

// UI Imports
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as locales from "@mui/material/locale";

// UI Components Imports
import SignIn from "./views/auth/SignIn";
import DefaultLayout from "./layout/DefaultLayout";
import Request from "./views/Request";
import Emails from "./views/Emails";
import NetFree from "./views/NetFree";
import Clients from "./views/Clients";
import ClientDetails from "./views/ClientDetails";
import ClientsForm from "./views/ClientsForm";
import Logs from "./views/Logs";
import Users from "./views/Users";
import EmailTemplating from "./views/EmailTemplating";
import RouteGuard from "./component/common/RouteGuard";

// CSS imports
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Third part Imports
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Icon imports
import { MdOutlineContactSupport, MdOutlineSettings } from "react-icons/md";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import { IoLogoBuffer } from "react-icons/io";
import FormsIcon from "../src/assets/images/forms.svg";
import FormsDarkIcon from "../src/assets/images/forms_dark.svg";

// Utils imports
import { DEFAULT_LANGUAGE } from "./constants";
import { ACCESS_TOKEN_KEY } from "./constants";
import Forms from "./views/Forms";
import FormDetails from "./views/FormDetails";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ClientFormsTable from "./views/ClientFormsTable";
import Config from "./views/apiConfig";
import Automation from "./views/Automation";
import AutomationDetails from "./views/AutomationDetails";

function App() {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const [locale, setLocale] = React.useState("heIL");
  const lang = localStorage.getItem(DEFAULT_LANGUAGE);

  useEffect(() => {
    if (localStorage.getItem(DEFAULT_LANGUAGE)) {
      const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
      if (defaultLanguageValue === "he") {
        document.body.dir = "rtl";
        i18next.changeLanguage("he");
        setLocale("heIL");
      } else {
        document.body.dir = "ltr";
        i18next.changeLanguage("en");
        setLocale("enUS");
      }
    } else {
      localStorage.setItem(DEFAULT_LANGUAGE, "he");
      document.body.dir = "rtl";
      i18next.changeLanguage("he");
      setLocale("heIL");
    }
  }, [lang]);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#f50057",
      },
    },

    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: "#0B99FF",
            height: "2.5px",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: "#5C5C5C",
            "&.Mui-selected": {
              color: "#1C1C1C",
            },
          },
        },
      },
    },
  });

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme]
  );

  const routes = [
    // {
    //   name: t('sidebar.dashboard'),
    //   path: "dashboard",
    //   icon: <MdHome className="h-6 w-6" />,
    //   component: <Dashboard />,
    // },
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
        <img src={FormsDarkIcon} alt="forms-icon" className="h-6 w-6 -mt-4" />
      ),
      component: <ClientFormsTable />,
    },
    {
      name: t("sidebar.users"),
      path: "settings/users",
      type: "menu",
      icon: <HiOutlineUsers className="h-6 w-6" />,
      component: <Users />,
    },
    {
      name: t("clients.clientDetails"),
      path: "clients/:id",
      component: <ClientDetails />,
    },
    {
      name: t("clients.clientFormSettings"),
      path: "settings/formSettings",
      component: <ClientsForm />,
    },
    {
      name: t("sidebar.automation"),
      path: "settings/automation",
      component: <Automation />,
    },
    {
      name: t("sidebar.automation"),
      path: "settings/automation/new-workflow",
      component: <AutomationDetails />,
    },
    {
      name: t("sidebar.formCreation"),
      path: "settings/forms",
      component: <Forms />,
    },
    {
      name: t("sidebar.formCreation"),
      path: "settings/forms/:id",
      component: <FormDetails />,
    },
    {
      name: t("sidebar.formCreation"),
      path: "settings/forms/new-form",
      component: <FormDetails />,
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
    {
      name: t("sidebar.logs"),
      path: "settings/logs",
      type: "menu",
      icon: <IoLogoBuffer className="h-6 w-6" />,
      component: <Logs />,
    },
    {
      name: t("sidebar.config"),
      path: "settings/config",
      type: "menu",
      icon: <IoLogoBuffer className="h-6 w-6" />,
      component: <Config/>,
    },
    // {
    //   name: t('sidebar.profile'),
    //   path: "profile",
    //   icon: <MdPerson className="h-6 w-6" />,
    //   component: <Profile />,
    // }
  ];

  return (
    <Provider store={store}>
      <ThemeProvider theme={themeWithLocale}>
        <Router>
          <Routes>
            <Route exact path="/signin" element={<SignIn />} />
            <Route
              element={
                <RouteGuard token={ACCESS_TOKEN_KEY} routeRedirect="/signin" />
              }
            >
              <Route
                path="/*"
                element={<Navigate to={routes[0].path} replace />}
              />
              {routes.map((prop, key) => {
                return (
                  <Route
                    path={`/${prop.path}`}
                    element={
                      <DefaultLayout route={prop}>
                        {prop.component}
                      </DefaultLayout>
                    }
                    key={key}
                  />
                );
              })}
            </Route>
          </Routes>
        </Router>
        <ToastContainer autoClose={2000} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
