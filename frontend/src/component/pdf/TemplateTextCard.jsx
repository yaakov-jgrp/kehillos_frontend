// React imports
import React, { useState } from "react";

// Icon imports
import DotsIcon from "../../assets/images/dots.svg";
import BinIcon from "../../assets/images/bin.svg";
import EditButtonIcon from "../common/EditButton";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE } from "../../constants";

function TemplateTextCard({ onEdit, deleteTemplate, template, writePermission, updatePermission, deletePermission }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const lang = localStorage.getItem(DEFAULT_LANGUAGE);

  return (
    <>
      <div
        className="bg-white shadow-custom relative h-[200px] p-5 rounded-lg w-[360px] break-words flex flex-col gap-4 overflow-visible scrollbar-hide"
        key={template.id}
      >
        <div className="flex items-center justify-between sticky top-0">
          <div className="bg-[#F2F8FB] flex justify-center items-center px-6 py-2 rounded-full">
            <p className="text-sm text-gray-10">
              {t("clients.id")}: #{template.id}
            </p>
          </div>
          <button onClick={() => setIsMenuOpen((prevState) => !prevState)}>
            <img src={DotsIcon} alt="DotsIcon" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <p className="text-gray-10 text-[14px] capitalize">
              {t("dataTypes.text")}:
            </p>
            <p className="text-gray-11 text-[14px] font-medium">
              {template.text}
            </p>
          </div>

          <div className="flex gap-1">
            <p className="text-gray-10 text-[14px] capitalize">
              {t("emails.text_type")}:
            </p>
            <p className="text-gray-11 text-[14px] font-medium">
              {template.text}
            </p>
          </div>

          <div className="flex gap-1">
            <p className="text-gray-10 text-[14px] capitalize">
              {t("emails.website")}:
            </p>
            <p className="text-gray-11 text-[14px] font-medium">
              {template.website}
            </p>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className={`bg-white w-[175px] absolute z-10 ${
              lang === "he" ? "-left-2" : "-right-2"
            } ${
              lang === "he" ? "md:left-6" : "md:right-6"
            } top-14 md:top-16 flex flex-col gap-3 shadow-md rounded-lg p-2`}
          >
            <div
              className={`flex items-center gap-2 ${updatePermission ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={updatePermission ? ()=>{} : () => onEdit(template.id)}
            >
              <EditButtonIcon />
              <p className="text-md">{t("emails.edit")}</p>
            </div>

            <div
              className={`flex items-center gap-2 ${deletePermission ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={deletePermission ? ()=>{} : deleteTemplate}
            >
              <img
                src={BinIcon}
                alt="BinIcon"
                className={deletePermission ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}
              />
              <p className="text-md">{t("emails.delete")}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TemplateTextCard;
