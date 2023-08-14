import { useState, useEffect } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import SignIn from "./views/auth/SignIn";
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

function App() {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();

  useEffect(()=> {
    if(localStorage.getItem(DEFAULT_LANGUAGE)){
      const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
      if(defaultLanguageValue === 'he') {
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
  },[])

  const Guard = ({ token, routeRedirect }) => {
    const location = useLocation();

    return localStorage.getItem(token) ? (
      <Outlet />
    ) : (
      <Navigate to={routeRedirect} replace state={{ from: location }} />
    );
  };


  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route exact path="/signin" element={<SignIn />} />

            <Route element={<Guard token={ACCESS_TOKEN_KEY} routeRedirect="/signin" />}>
              <Route path="/*" element={<DefaultLayout />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
