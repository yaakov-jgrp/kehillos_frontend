// React imports
import React from "react";

// UI Components Imports
import ToggleSwitch from "../common/ToggleSwitch";
import CrossIcon from "../../assets/images/cross.svg";

// Third part Imports
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";

// API services
import clientsService from "../../services/clients";

const DisplayFieldsModal = ({
  showModal,
  setShowModal,
  formValues,
  displayFields,
  onClick,
}) => {
  const { t } = useTranslation();
  const defaultValues = formValues;
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  const submitForm = async (data, e) => {
    e.preventDefault();
    let formData = {
      fields: [],
    };

    displayFields.forEach((field) => {
      formData.fields.push({
        id: field.id,
        display: data[field.field_slug],
        other_columns_added: field?.other_columns_added?.filter(i=>i?.id !== field?.id)?.map((i) => ({
          field_id: i?.id,
          display_order: i?.display_order,
        })),
      });
    });

    const res = await clientsService.updateBlockField(formData);
    setShowModal(false);
    onClick();
  };

  const { control, handleSubmit } = useForm({
    defaultValues,
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
                  style={{
                    width: "100%",
                    position: "relative",
                  }}
                  method="post"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit((data, e) => submitForm(data, e))}
                >
                  <div className="flex items-center justify-between border-b border-b-[#E3E5E6] p-5 rounded-t">
                    <h3 className="text-lg font-medium">
                      {t("clients.display")}
                    </h3>
                    <button
                      className=""
                      onClick={() => setShowModal(false)}
                      type="button"
                    >
                      <img src={CrossIcon} alt="cross-icon" />
                    </button>
                  </div>

                  <div className="relative p-6 flex-auto max-h-[calc(90vh-170px)] overflow-y-auto">
                    {displayFields.length > 0 &&
                      displayFields.map((fieldData, index) => {
                        return (
                          <div
                            className="flex items-center justify-between mb-4"
                            key={index}
                          >
                            <label className="block text-gray-10 text-md font-normal">
                              {lang === "he"
                                ? fieldData?.field_name_language.he
                                : fieldData?.field_name}
                            </label>
                            <Controller
                              name={fieldData?.field_slug}
                              control={control}
                              render={({ field: { value, onChange } }) => {
                                return (
                                  <ToggleSwitch
                                    clickHandler={onChange}
                                    selected={value}
                                  />
                                );
                              }}
                            />
                          </div>
                        );
                      })}
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
                      className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
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
