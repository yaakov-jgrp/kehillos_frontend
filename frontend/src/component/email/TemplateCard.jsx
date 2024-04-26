// React imports
import React, { useState } from "react";

// UI components imports
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";

// Icon imports
import { MdDelete, MdEdit } from "react-icons/md";
import { HiDuplicate } from "react-icons/hi";
import BlueMailIcon from "../../assets/images/blue_mail.svg";
import DotsIcon from "../../assets/images/dots.svg";
import CopyIcon from "../../assets/images/content_copy.svg";
import BinIcon from "../../assets/images/bin.svg";
import EditButtonIcon from "../common/EditButton";
import { useTranslation } from "react-i18next";

function TemplateCard({ duplicateTemplate, onEdit, deleteTemplate, template }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div
        className="bg-white shadow-custom relative h-[200px] p-5 rounded-lg w-[360px] break-words flex flex-col gap-4 overflow-visible scrollbar-hide"
        key={template.id}
      >
        <div className="flex items-center justify-between">
          <img src={BlueMailIcon} alt="BlueMailIcon" />
          <button onClick={() => setIsMenuOpen((prevState) => !prevState)}>
            <img src={DotsIcon} alt="DotsIcon" />
          </button>
        </div>

        <div>
          <p className="text-gray-11 text-[20px] md:text-[24px] font-medium">
            {template.name}
          </p>
          <p className="text-gray-11 text-[14px] font-normal">
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci
          </p>
        </div>

        {isMenuOpen && (
          <div className="bg-white w-[175px] absolute z-10 -right-2 md:right-6 top-14 md:top-16 flex flex-col gap-3 shadow-md rounded-lg p-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onEdit(template.id)}
            >
              <EditButtonIcon />
              <p className="text-md">{t("emails.edit")}</p>
            </div>

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => duplicateTemplate(template.id)}
            >
              <img
                src={CopyIcon}
                alt="CopyIcon"
                className="w-5 hover:cursor-pointer"
              />
              <p className="text-md">{t("emails.duplicate")}</p>
            </div>

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDeleteModal(true)}
            >
              <img
                src={BinIcon}
                alt="BinIcon"
                className="hover:cursor-pointer"
              />
              <p className="text-md">{t("emails.delete")}</p>
            </div>
          </div>
        )}
      </div>

      {deleteModal && (
        <DeleteConfirmationModal
          showModal={deleteModal}
          setShowModal={setDeleteModal}
          onClick={() => {
            deleteTemplate(template.id);
            setDeleteModal(false);
          }}
        />
      )}
    </>
  );
}

export default TemplateCard;
