// React imports
import React from "react";

// Third part Imports
import { useTranslation } from "react-i18next";

// Icon imports
import SearchSvg from "../../assets/images/search.svg";

function CustomSearchField(props) {
  const {
    label,
    id,
    extra,
    type,
    placeholder,
    variant,
    disabled,
    onChange,
    name,
    noBgColor,
  } = props;

  const { i18n } = useTranslation();

  return (
    <div
      className={`${extra} ${
        i18n.dir() === "rtl" ? "text-right" : "text-left"
      }`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`text-[10px] capitalize flex p-1 truncate md:text-[14px] text-gray-11 ${
            variant === "auth" ? "font-medium" : "font-bold"
          }`}
        >
          {label}
        </label>
      )}
      <div className="flex justify-center items-end relative">
        <input
          disabled={disabled}
          type={type}
          id={id}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className={`font-normal mt-6 h-10 w-full px-7 text-[14px] bg-transparent outline-none placeholder:text-gray-10 placeholder:font-normal ${
            noBgColor ? "border" : "bg-[#F2F8FB]"
          } rounded-lg`}
        />
        <img
          src={SearchSvg}
          alt="Search-Icon"
          className={`absolute ${
            i18n.dir() === "rtl"
              ? variant === "auth"
                ? "right-2"
                : "right-[10px]"
              : variant === "auth"
              ? "left-2"
              : "left-[10px]"
          } top-[44px] transform -translate-y-1/2`}
        />
      </div>
    </div>
  );
}

export default CustomSearchField;
