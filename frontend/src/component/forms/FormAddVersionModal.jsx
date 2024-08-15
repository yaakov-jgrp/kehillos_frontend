import React, { useEffect, useState } from "react";
import CrossIcon from "../../assets/images/cross.svg";
import { useTranslation } from "react-i18next";

export default function FormAddVersionModal({
  setShowModal,
  onClick,
  versionName,
  setVersionName,
  versionComments,
  setVersionComments,
}) {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  return (
    <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="scrollbar-hide w-[500px] border-0 rounded-xl shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
        <div className="flex items-center justify-between border-b border-b-[#E3E5E6] rounded-t px-4 py-2">
          <h3 className="text-lg font-medium">{t("forms.remark")}</h3>
          <button onClick={() => setShowModal(false)} type="button">
            <img src={CrossIcon} alt="cross-icon" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#1C1C1C]">
              {t("forms.versionName")}
            </label>
            <input
              id="name"
              type="text"
              className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#1C1C1C]">
              {t("forms.versionComments")}
            </label>
            <textarea
              id="name"
              rows={5}
              className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
              value={versionComments}
              onChange={(e) => setVersionComments(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              className="w-full text-gray-11 background-transparent font-normal py-2 text-sm outline-none focus:outline-none border border-gray-11 rounded-lg"
              type="button"
              onClick={() => setShowModal(false)}
            >
              {t("netfree.close")}
            </button>

            <button
              className="w-full text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 py-[9px] rounded-lg focus:outline-none"
              onClick={onClick}
            >
              {t("netfree.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
