// React imports
import { useState } from "react";

// UI Components Imports
import InputField from "../../component/fields/InputField";
import LanguageSelect from "../../component/common/LanguageSelect";

// Third part Imports
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// API services
import authService from "../../services/auth";

// Utils imports
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants/index";

// Images imports
import Logo from "../../assets/images/Kehillos_Logo.svg";

// Custom hooks imports
import useAlert from "../../Hooks/useAlert";

export default function SignIn() {
  const navigate = useNavigate();
  const formObject = {
    email: null,
    password: null,
  };

  const [formdata, setFormData] = useState(formObject);
  const { t } = useTranslation();
  const { setAlert } = useAlert();
  const handleLogin = async (event) => {
    event.preventDefault();
    authService
      .login(formdata.email, formdata.password)
      .then((data) => {
        if (data.status === 200) {
          setAlert(t("auth.loginSuccess"), "success");
          localStorage.setItem("logo_url", data.data.user.organization_logo_url);
          localStorage.setItem(ACCESS_TOKEN_KEY, data.data.access);
          localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refresh);
          navigate("/request");
        } else {
          setAlert(t("auth.loginFailed"), "error");
        }
      })
      .catch((error) => {
        setAlert(error.response.data.message, "error");
      });
  };
  const handleInput = (event) => {
    setFormData({ ...formdata, [event.target.name]: event.target.value });
  };

  const formValidate = () => {
    if (!formdata.email || !formdata.password) {
      return false;
    }
    if (formdata.email && !/\S+@\S+\.\S+/.test(formdata.email)) {
      return false;
    }
    if (formdata.password && formdata.password.length < 2) {
      return false;
    }
    return true;
  };
  return (
    <div className="relative w-screen h-screen bg-[#F9FBFC]">
      <div className="absolute top-0 left-0  bg-white shadow-custom py-2 w-screen px-4 flex items-center justify-between">
        <img src={Logo} className="h-[44px] md:h-[65px]" alt="Logo" />
        <LanguageSelect />
      </div>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex justify-center mt-32 md:mt-0 mb-12">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="w-screen md:w-[24rem] px-6 py-4 rounded-lg bg-white">
          <form onSubmit={handleLogin}>
            <InputField
              variant="auth"
              extra="mb-3"
              label={t("auth.email")}
              id="email"
              type="text"
              onChange={handleInput}
              name="email"
              placeholder={t("auth.emailPlaceholder")}
            />
            <InputField
              variant="auth"
              extra="mb-3"
              label={t("auth.password")}
              id="password"
              name="password"
              onChange={handleInput}
              placeholder={t("auth.passwordPlaceholder")}
              isPasswordInput
            />
            {/* <div className="mb-4 flex items-center justify-between px-2">
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href=" "
            >
              {t("auth.forgotPassword")}
            </a>
          </div> */}
            <button
              type="submit"
              className={`linear mt-2 w-full rounded-xl py-[12px] text-base font-medium transition duration-200 ${
                formValidate()
                  ? "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  : "bg-gray-300"
              }`}
            >
              {t("auth.signin")}
            </button>
          </form>

        </div>
                
        <div className="text-center mt-auto pt-10 pb-5 ">
      <p style={{ fontSize: '12px', color: '#4597f7' }}>Powering tomorrow <a href="https://jgrp.dev">jgrp.dev</a></p>
      
    </div>
      </div>
    </div>
  );
}
