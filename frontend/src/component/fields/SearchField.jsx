// React imports
import React from "react";

// Third part Imports
import { useTranslation } from "react-i18next";

// Icon imports
import { FiSearch } from "react-icons/fi";
import SearchSvg from "../../assets/images/search.svg";

function SearchField(props) {
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
    value,
    noUnderline,
    borderRadius,
  } = props;

  const { i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  return (
    <div
      className={`${extra} ${
        i18n.dir() === "rtl" ? "text-right" : "text-left"
      }`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`${
            lang === "he" ? "text-xl" : "text-[10px]"
          } capitalize flex p-1 truncate md:text-[14px] text-gray-11 ${
            variant === "auth" ? "font-medium" : "font-bold"
          }`}
        >
          {label}
        </label>
      )}
      <div className="flex justify-center items-end relative">
        {value && (
          <input
            value={value}
            disabled={disabled}
            type={type}
            id={id}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            className={`font-normal mt-6 h-9 w-full px-6 text-[14px] bg-transparent outline-none placeholder:text-gray-10 placeholder:font-normal bg-white border-[1px] border-[#E3E5E6] rounded-full`}
          />
        )}
        {!value && (
          <input
            disabled={disabled}
            type={type}
            id={id}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            className={`font-normal mt-6 h-9 w-full px-6 text-[14px] bg-transparent outline-none placeholder:text-gray-10 placeholder:font-normal bg-white border-[1px] border-[#E3E5E6] rounded-full`}
          />
        )}
        <img
          src={SearchSvg}
          alt="Search-Icon"
          className={`absolute ${
            i18n.dir() === "rtl"
              ? variant === "auth"
                ? "right-1"
                : "right-[10px]"
              : variant === "auth"
              ? "left-2"
              : "left-[10px]"
          } top-[42px] transform -translate-y-1/2`}
        />
        {/* <span
          className={`absolute ${
            i18n.dir() === "rtl"
              ? variant === "auth"
                ? "right-1"
                : "right-[10px]"
              : variant === "auth"
              ? "left-1"
              : "left-[10px]"
          } top-3/5 transform -translate-y-1/2`}
        >
          <FiSearch className="h-3.5 w-3.5 text-[#2B3674]" />
        </span> */}
      </div>
    </div>
  );
}

export default SearchField;
