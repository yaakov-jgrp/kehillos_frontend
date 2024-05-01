// React imports
import React from "react";

// Third part Imports
import { useTranslation } from "react-i18next";
import CrossIcon from "../../assets/images/cross.svg";
import WhiteBin from "../../assets/images/white_bin_1.svg";

function DeleteConfirmationModal({ showModal, setShowModal, onClick }) {
  const { t } = useTranslation();
  return (
    <>
      {showModal && (
        <div className="fixed left-0 bottom-0 z-[99] h-screen w-screen bg-[#00000020] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-7xl">
              <div className="w-[400px] overflow-y-auto border-0 rounded-2xl shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-between p-5 rounded-t border border-[#E3E5E6]">
                  <h3 className="text-md font-medium">
                    {t("common.deleteConfirmation")}
                  </h3>
                  <button onClick={() => setShowModal(false)} type="button">
                    <img src={CrossIcon} alt="CrossIcon" />
                  </button>
                </div>

                <div className="relative p-5 mt-3 flex flex-col gap-2 justify-center items-center max-h-[calc(90vh-170px)] overflow-y-auto">
                  <div className="w-[80px] h-[80px] bg-[#EB5757] rounded-full flex justify-center items-center">
                    <img src={WhiteBin} alt="WhiteBin" />
                  </div>
                  <p className="text-md font-medium -mb-2">
                    {t("common.deletePermission")}
                  </p>
                  <p className="text-md font-medium">
                    {t("common.deleteNote")}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 p-5 mb-5">
                  <button
                    className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {t("netfree.close")}
                  </button>
                  <button
                    className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                    onClick={onClick}
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteConfirmationModal;
