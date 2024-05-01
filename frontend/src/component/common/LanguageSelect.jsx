import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// Images imports
import LanguageEarth from "../../assets/images/language_earth.svg";

// Third party Imports
import i18next from "i18next";

// Utils imports
import { DEFAULT_LANGUAGE } from "../../constants/index";

const languages = {
  en: "Eng",
  he: "עב",
  // Add more languages here as needed
};

const LanguageSelect = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem(DEFAULT_LANGUAGE) || "he"
  );
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown open and close for the arrow icon
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close the dropdown when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#language-select-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setDefaultLanguage = (langCode) => {
    setSelectedLanguage(langCode);
    localStorage.setItem(DEFAULT_LANGUAGE, langCode);
    i18next.changeLanguage(langCode);
    setIsOpen(false); // Close the menu after selection
  };

  return (
    <div
      id="language-select-container"
      className="relative inline-block text-left"
    >
      <div
        className="w-[114px] rounded-lg pl-4 pr-2 py-2 border-[1.5px] border-[#E3E5E6] inline-flex items-center justify-between"
        onClick={toggleDropdown}
      >
        <img src={LanguageEarth} alt="Language" className="mr-2" />
        <span>{languages[selectedLanguage]}</span>
        {isOpen ? <IoIosArrowUp size="1em" /> : <IoIosArrowDown size="1em" />}
      </div>
      {isOpen && (
        <ul className="absolute w-full mt-1 bg-white shadow-lg rounded-md overflow-hidden z-10">
          {Object.entries(languages).map(([langCode, langLabel]) => (
            <li
              key={langCode}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setDefaultLanguage(langCode)}
            >
              {langLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelect;
