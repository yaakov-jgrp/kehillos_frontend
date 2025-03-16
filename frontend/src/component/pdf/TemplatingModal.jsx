// React imports
import React, { useEffect, useState } from "react";

// UI Imports
import { MenuItem, Select } from "@mui/material";

// UI Components Imports
import ErrorMessage from "../common/ErrorMessage";
import FieldLabel from "../fields/FormLabel";
import CustomCheckBox from "../fields/checkbox";

// Third part Imports
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CrossIcon from "../../assets/images/cross.svg";

// API services
import emailService from "../../services/email";

// Utils imports
import { templateTextTypes, websiteChoices } from "../../lib/FieldConstants";

function TemplatingModal({
  showModal,
  setShowModal,
  textData,
  newtext,
  onClick,
}) {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  const [defaultValues, setDefaultValues] = useState({
    text: "",
    text_type: templateTextTypes[0],
    website: websiteChoices[0],
    is_default: false,
  });

  const hoursWebsiteChoices = ["open_url_temporary", "open_domain_temporary"];

  const schema = yup.object().shape({
    text: yup
      .string()
      .min(
        3,
        `${t("dataTypes.text")} ${t("messages.mustContain")} 3 ${t(
          "messages.characters"
        )}`
      )
      .required(
        `${t("datatypes.text")} ${t("clients.is")} ${t("clients.required")}`
      ),
    website: yup.string().required(),
    text_type: yup.string().required(),
    is_default: yup.boolean().notRequired(),
  });

  const {
    control,
    setValue,
    reset,
    watch,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const submitForm = async (data, e) => {
    e.preventDefault();
    try {
      if (newtext) {
        const res = await emailService.createTemplatingText(data);
      } else {
        const res = await emailService.updateTemplatingText(data, textData?.id);
      }
      setShowModal(false);
      reset();
      onClick();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!newtext) {
      setValue("text", textData?.text);
      setValue("text_type", textData?.text_type);
      setValue("website", textData?.website);
      setValue("start_hour", textData?.start_hour);
      setValue("end_hour", textData?.end_hour);
      setValue("is_default", textData?.is_default);
    }
  }, []);

  return (
    <>
      {showModal && (
        <div className="fixed left-0 bottom-0 z-[99] h-screen w-screen bg-[#00000080] flex justify-center items-center">
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-7xl">
              <div className="w-[100%] min-w-[80vw] md:min-w-[70vw] lg:min-w-[60vw] overflow-y-auto border-0 rounded-2xl shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
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
                  <div className="flex items-center justify-between p-5 rounded-t border-b border-b-[#E3E5E6]">
                    <h3 className="text-lg font-medium">
                      {newtext ? t("emails.newText") : t("emails.editText")}
                    </h3>
                    <button
                      className="bg-transparent border-0 text-black float-right"
                      onClick={() => setShowModal(false)}
                      type="button"
                    >
                      <img src={CrossIcon} alt="cross-icon" />
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto overflow-y-auto">
                    <div className="mb-6 flex flex-col w-full">
                      <FieldLabel
                        className={`${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("dataTypes.text")}
                      </FieldLabel>
                      <div className="">
                        <Controller
                          name="text"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="text"
                              className="appearance-none outline-none border rounded-lg w-full p-2 text-black"
                              {...field}
                            />
                          )}
                        />
                        {errors.text && (
                          <ErrorMessage message={errors.text.message} />
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex flex-col w-full">
                      <FieldLabel
                        className={`${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("emails.text_type")}
                      </FieldLabel>
                      <div className="">
                        <Controller
                          name="text_type"
                          control={control}
                          render={({ field }) => (
                            <Select
                              MenuProps={{
                                sx: {
                                  maxHeight: "250px",
                                },
                              }}
                              className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                              {...field}
                              placeholder="Select"
                            >
                              {templateTextTypes?.map((el, i) => {
                                return el !== "" ? (
                                  <MenuItem key={i} value={el}>
                                    {t(`emails.${el}`)}
                                  </MenuItem>
                                ) : null;
                              })}
                            </Select>
                          )}
                        />
                        {errors.text_type && (
                          <ErrorMessage message={errors.text_type.message} />
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex flex-col w-full">
                      <FieldLabel
                        className={`${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("emails.website")}
                      </FieldLabel>
                      <div className="">
                        <Controller
                          name="website"
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Select
                              MenuProps={{
                                sx: {
                                  maxHeight: "250px",
                                },
                              }}
                              value={value}
                              className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                              onBlur={onBlur}
                              onChange={(e) => {
                                if (
                                  hoursWebsiteChoices.includes(e.target.value)
                                ) {
                                  setValue("start_hour", null, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                  setValue("end_hour", null, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                }
                                onChange(e);
                              }}
                              placeholder="Select"
                            >
                              {websiteChoices?.map((el, i) => {
                                return el !== "" ? (
                                  <MenuItem key={i} value={el}>
                                    {t(`emails.${el}`)}
                                  </MenuItem>
                                ) : null;
                              })}
                            </Select>
                          )}
                        />
                        {errors.website && (
                          <ErrorMessage message={errors.website.message} />
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex items-center w-full">
                      <div className="mx-2">
                        <Controller
                          name="is_default"
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <CustomCheckBox
                              checked={value}
                              onChange={onChange}
                              onBlur={onBlur}
                            />
                          )}
                        />
                      </div>
                      <FieldLabel
                        className={`mt-1 ${lang === "he" ? "ml-6" : "mr-6"}`}
                      >
                        {t("clients.setAsDefault")}
                      </FieldLabel>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-6">
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
      )}
    </>
  );
}

export default TemplatingModal;
