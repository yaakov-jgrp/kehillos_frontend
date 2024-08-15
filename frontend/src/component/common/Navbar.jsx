// UI Components Imports
import LanguageSelect from "./LanguageSelect";

// Third part Imports
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Icon imports
import { FiAlignJustify } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

// Images imports
import PersonAvatar from "../../assets/images/person_avatar.svg";
import Notification from "../../assets/images/notification.svg";
import { USER_DETAILS } from "../../constants";

const Navbar = (props) => {
  const { onOpenSidenav, brandText, brandName } = props;
  const { t, i18n } = useTranslation();
  const { first_name, last_name } = JSON.parse(
    localStorage.getItem(USER_DETAILS)
  );

  const routeTextArray = brandText.split("/").map((item) => {
    if (isNaN(Number(item))) {
      return t(`routes.${item}`);
    }
    return item;
  });

  console.log(routeTextArray);

  return (
    <nav
      className={`!z-40 sticky flex flex-row flex-wrap items-center justify-between rounded-2xl bg-white mt-2 pb-2 pt-4 px-6 shadow-custom backdrop-blur-xl dark:bg-[#0b14374d] ${i18n.dir() === "rtl" ? "xl:ml-1 xl:mr-4 mr-2" : "xl:mx-4"
        }`}
    >
      {/* <div className="ms-[6px]">
        <div className="h-6 w-auto">
          <a
            className="text-sm font-normal text-black hover:underline dark:text-white dark:hover:text-white opacity-25"
            href=" "
          >
            {t("common.pages")}
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <span className="text-sm font-normal text-black hover:underline dark:text-white dark:hover:text-white opacity-25">
            /
          </span>
          {routeTextArray.map((routeText, index) => (
            <Link
              className={`text-sm font-normal capitalize text-black hover:underline dark:text-white dark:hover:text-white ${
                index === routeTextArray.length - 1 ? "opacity-1" : "opacity-25"
              }`}
              to="#"
            >
              {index !== 0 && (
                <span className="text-sm font-normal text-black hover:underline dark:text-white dark:hover:text-white opacity-25">
                  /
                </span>
              )}
              {routeTextArray[0].toLowerCase() === "clients" &&
              index === routeTextArray.length - 1 &&
              routeTextArray.length > 1
                ? "Clients Details"
                : routeText}
            </Link>
          ))}
        </div>
        <p className="shrink text-[28px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandName}
          </Link>
        </p>
      </div> */}

      <div className="h-6 w-auto flex gap-4">
        <a
          className="text-sm font-normal text-black hover:underline dark:text-white dark:hover:text-white opacity-25"
          href=" "
        >
          {t("common.pages")}
        </a>
        <span className="text-sm font-normal text-black hover:underline dark:text-white dark:hover:text-white opacity-25">
          /
        </span>
        {routeTextArray.map((routeText, index) => (
          <Link
            className={`text-sm font-normal capitalize text-black hover:underline dark:text-white dark:hover:text-white ${index === routeTextArray.length - 1 ? "opacity-1" : "opacity-25"
              }`}
            to="#"
            key={routeText}
          >
            {index !== 0 && (
              <span className="text-sm font-normal text-black hover:underline dark:text-white dark:hover:text-white opacity-25">
                /
              </span>
            )}
            {index === routeTextArray.length - 1 &&
              routeTextArray.length > 1 ? (
              <span className="ml-4">
                {routeTextArray[0].toLowerCase() === "clients"
                  ? "Clients Details"
                  : routeTextArray[1].toLowerCase() === "form settings"
                  ? ""
                  : routeText}
              </span>
            ) : (
              routeText
            )}
          </Link>
        ))}
      </div>

      <div className="flex w-auto items-center gap-8">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <div className="relative cursor-pointer">
          <img src={Notification} alt="Notification" />

          {/* Notifications Container */}
          {/* <div className="bg-[#FF0031] absolute -top-4 left-2 px-1 rounded-full flex justify-center items-center">
            <p className="font-semibold text-white text-[12px]">20</p>
          </div> */}
        </div>
        <LanguageSelect />
        <div className="flex items-center gap-2">
          <img
            src={PersonAvatar}
            alt="avatar"
            className="w-8 h-8 rounded-lg/2"
          />
          <p>
            {first_name} {last_name}
          </p>
          <IoIosArrowDown size="1em" className="cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
