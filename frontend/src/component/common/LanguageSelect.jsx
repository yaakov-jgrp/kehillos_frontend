import i18next from "i18next";
import { DEFAULT_LANGUAGE } from '../../constants/index';
import { useEffect, useState } from "react";

const LanguageSelect = ({customClass}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  const setDefaultLangauage = (value) => {
    localStorage.setItem(DEFAULT_LANGUAGE, value);
    i18next.changeLanguage(value);
    setSelectedLanguage(value);
  }

  useEffect(()=> {
    if(localStorage.getItem(DEFAULT_LANGUAGE)){
      const defaultLanguageValue = localStorage.getItem(DEFAULT_LANGUAGE);
      setSelectedLanguage(defaultLanguageValue);
    } else {
      setSelectedLanguage('he');
    }
  },[])
  return (
    <>
      <select onChange={(e) => setDefaultLangauage(e.target.value)} className={customClass} value={selectedLanguage}>
        <option value="en" className={ `p-2` }>En</option>
        <option value="he" className={ `p-2` }>עב</option>
      </select>
    </>
  );
};

export default LanguageSelect;
