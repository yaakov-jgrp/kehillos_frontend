// React imports
import React, { useEffect, useState } from "react";

// UI Components Imports
import ToggleSwitch from "../common/ToggleSwitch";
import CrossIcon from "../../assets/images/cross.svg";

// Third part Imports
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";

const DisplayFieldsModal = ({ showModal, setShowModal, onClick, disabled }) => {
  const { t } = useTranslation();
  const defaultDisplayFields = {
    name: true,
    clientId: true,
    createdAt: true,
    lastEditedAt: true,
  };

  const [displayFields, setDisplayFields] = useState(
    JSON.parse(localStorage.getItem("displayFields")) || defaultDisplayFields
  );

  useEffect(() => {
    localStorage.setItem("displayFields", JSON.stringify(displayFields));
  }, [displayFields]);

  const submitForm = () => {
    setShowModal(false);
    onClick(displayFields);
  };

  const { control, handleSubmit } = useForm({
    defaultValues: displayFields,
    mode: "onBlur",
  });

  return (
    <>
      {showModal ? (
        <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="min-w-300px md:min-w-[400px] overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <form
                  style={{ width: "100%", position: "relative" }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(submitForm)}
                >
                  <div className="flex items-center justify-between border-b border-b-[#E3E5E6] p-5 rounded-t">
                    <h3 className="text-lg font-medium">
                      {t("clients.display")}
                    </h3>
                    <button onClick={() => setShowModal(false)} type="button">
                      <img src={CrossIcon} alt="cross-icon" />
                    </button>
                  </div>

                  <div className="relative p-6 flex-auto max-h-[calc(90vh-170px)] overflow-y-auto">
                    {Object.keys(displayFields).map((field, index) => (
                      <div
                        className="flex items-center justify-between mb-4"
                        key={index}
                      >
                        <label className="block text-gray-10 text-md font-normal">
                          {t(`forms.${field}`)}
                        </label>
                        <Controller
                          name={field}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <ToggleSwitch
                              disabled={disabled}
                              clickHandler={(val) => {
                                setDisplayFields((prev) => ({
                                  ...prev,
                                  [field]: val.target.checked,
                                }));
                              }}
                              selected={displayFields[field]}
                            />
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 my-8">
                    <button
                      className="text-gray-11 background-transparent font-normal py-2 text-sm outline-none w-[136px] focus:outline-none border border-gray-11 rounded-lg"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      {t("netfree.close")}
                    </button>
                    <button
                      disabled={disabled}
                      className="text-white disabled:cursor-not-allowed text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                      type="submit"
                    >
                      {t("netfree.save")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default React.memo(DisplayFieldsModal);
