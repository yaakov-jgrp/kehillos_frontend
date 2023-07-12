import { useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import SignIn from "./views/auth/SignIn";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";

function App() {
  const [count, setCount] = useState(0);
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();

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

            <Route element={<Guard token="user" routeRedirect="/signin" />}>
              <Route path="/*" element={<DefaultLayout />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
