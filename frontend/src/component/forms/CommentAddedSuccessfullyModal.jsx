import React from "react";
import CheckCircle from "../../assets/images/check_circle.svg";
import { useTranslation } from "react-i18next";

export default function CommentAddedSuccessfullyModal({ onClick }) {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  return (
    <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#2e2e2e80] flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-[380px] border-0 rounded-xl shadow-lg relative bg-white outline-none focus:outline-none p-5">
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          <img src={CheckCircle} alt="check_circle" />
          <h3 className="text-lg font-medium">
            {t("forms.commentAddedSuccessfully")}
          </h3>
        </div>
        <button
          className={`w-full h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
          onClick={onClick}
        >
          {t("forms.goBack")}
        </button>
      </div>
    </div>
  );
}
