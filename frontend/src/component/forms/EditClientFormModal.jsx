import React, { useEffect, useState } from "react";
import CrossIcon from "../../assets/images/cross.svg";
import AddCircleIcon from "../../assets/images/add_circle.svg";
import { useTranslation } from "react-i18next";
import { MenuItem, Select } from "@mui/material";
import { Accordion } from "@chakra-ui/react";
import CustomAccordion from "../common/Accordion";
import PhoneInput from "react-phone-number-input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { handleNumberkeyPress } from "../../lib/CommonFunctions";
import {
  checkBoxConstants,
  DateFieldConstants,
  NumberFieldConstants,
  TextFieldConstants,
} from "../../lib/FieldConstants";
import formsService from "../../services/forms";
import { MdOutlineUploadFile } from "react-icons/md";
import CustomCheckBox from "../fields/checkbox";
import dayjs from "dayjs";
import en from "react-phone-number-input/locale/en";
import he from "react-phone-number-input/locale/he";
import { transformFormDataForAddNewClientForm } from "../../utils/helpers";
import { toast } from "react-toastify";
import formService from "../../services/forms";

export default function EditClientFormModal({
  setShowModal,
  setShowSuccessModal,
  clientId,
  formId,
  clientDetailForm,
}) {
  const { t } = useTranslation();

  // State for select inputs
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [activeFormState, setActiveFormState] = useState(null);

  function addRepeatableBlock(blockId) {
    const activeFormStateObj = { ...activeFormState };
    // Find the block to repeat
    const blockToRepeat = activeFormStateObj.blocks.find(
      (block) => block.id === blockId
    );

    // Create a new block with an incremented ID
    const newBlockId =
      Math.max(...activeFormState.blocks.map((block) => block.id)) + 1;
    const newBlock = {
      ...blockToRepeat,
      id: newBlockId,
      isRepeatable: false,
    };

    // Find fields associated with the block
    const fieldsToRepeat = activeFormStateObj.fields.filter(
      (field) => field.blockId === blockId
    );

    // Create new fields with incremented IDs and updated blockId
    const newFields = fieldsToRepeat.map((field) => {
      const newFieldId = Math.random() + Date.now();
      return { ...field, id: newFieldId, blockId: newBlockId };
    });

    // Append the new block, fields, and conditions to activeFormStateObj
    activeFormStateObj.blocks.push(newBlock);
    activeFormStateObj.fields.push(...newFields);

    setActiveFormState(activeFormStateObj);
  }

  const updateFieldValue = (fieldId, newValue) => {
    setActiveFormState((prevState) => {
      const updatedFields = prevState.fields.map((field) => {
        if (field.id === fieldId) {
          return {
            ...field,
            defaultvalue: newValue,
          };
        }
        return field;
      });

      return {
        ...prevState,
        fields: updatedFields,
      };
    });
  };

  const submitFormHandler = async () => {
    try {
      const finalPayload = {};
      const blockToRemoveID = activeFormState.blocks.filter(
        (block) => block.isRepeatable
      )[0].id;
      finalPayload.name = activeFormState.name;
      finalPayload.isPined = activeFormState.isPined;
      finalPayload.clientId = clientValue;
      finalPayload.blocks = activeFormState.blocks
        .filter((block) => !block.isRepeatable)
        .map((block) => ({
          id: block.id,
          name: block.name,
          isRepeatable: block.isRepeatable,
        }));
      finalPayload.fields = activeFormState.fields
        .filter((field) => field.blockId !== blockToRemoveID)
        .map((field) => ({
          blockId: field.blockId,
          name: field.name,
          data_type: field.data_type,
          enum_values: field.enum_values,
          required: field.required,
          unique: field.unique,
          defaultvalue: field.defaultvalue,
        }));
      console.log("The final payload for the API is: ");
      const newClientFormRequestBody =
        transformFormDataForAddNewClientForm(finalPayload);
      console.log(newClientFormRequestBody);
      // const newClientFormPayload = await formService.createNewClientForm(
      //   newClientFormRequestBody
      // );
      setShowSuccessModal(true);
      setShowModal(false);
    } catch (error) {
      toast.error(JSON.stringify(error));
      console.log(error);
    }
  };

  const evaluateCondition = (condition, fieldValue) => {
    switch (condition.condition) {
      case "equals":
        return fieldValue === condition.value;
      case "not_equals":
        return fieldValue !== condition.value;
      case "starts_with":
        return fieldValue.startsWith(condition.value);
      case "not_starts_with":
        return !fieldValue.startsWith(condition.value);
      case "ends_with":
        return fieldValue.endsWith(condition.value);
      case "not_ends_with":
        return !fieldValue.endsWith(condition.value);
      case "contains":
        return fieldValue.includes(condition.value);
      case "not_contains":
        return !fieldValue.includes(condition.value);
      case "is_empty":
        return fieldValue === "";
      case "is_not_empty":
        return fieldValue !== "";
      default:
        return true;
    }
  };

  const shouldRenderField = (field, fields, conditions) => {
    const fieldConditions = conditions.filter(
      (cond) => cond.fieldId === field.id
    );
    let renderField = true;

    fieldConditions.forEach((condition) => {
      const conditionedField = fields.find((f) => f.name === condition.field);
      const fieldValue = conditionedField ? conditionedField.defaultvalue : "";

      const conditionMet = evaluateCondition(condition, fieldValue);

      if (condition.operator === "AND") {
        renderField = renderField && conditionMet;
      } else if (condition.operator === "OR") {
        renderField = renderField || conditionMet;
      }
    });

    return renderField;
  };

  const renderFields = (fields) => {
    return fields.map((field, index) => {
      if (
        shouldRenderField(
          field,
          activeFormState.fields,
          activeFormState.conditions
        )
      ) {
        const isCheckBox = checkBoxConstants.includes(field.data_type.value);
        return (
          <div className="mb-2 px-2 flex flex-col gap-1" key={index}>
            <div
              className={`flex items-center justify-between ${
                isCheckBox ? "ml-2 w-full" : "mb-1"
              }`}
            >
              <div className="flex items-center">
                <label className="block text-gray-700 text-md font-normal">
                  {field.name}
                </label>
                <p className="text-md mx-1 capitalize text-gray-600 font-normal">{`(${field.data_type.value})`}</p>
              </div>
            </div>
            <div>
              {TextFieldConstants.includes(field.data_type.value) && (
                <input
                  type={field.data_type.value}
                  className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                  value={field.defaultvalue}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                />
              )}

              {NumberFieldConstants.includes(field.data_type.value) && (
                <input
                  type="number"
                  min="0"
                  className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                  value={field.defaultvalue}
                  onKeyDown={handleNumberkeyPress}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                />
              )}

              {field.data_type.value === "phone" && (
                <PhoneInput
                  labels={lang === "en" ? en : he}
                  className="appearance-none outline-none border border-[#E3E5E6] rounded-lg p-2 text-gray-11 [&>input]:outline-none [&>input]:bg-white placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                  defaultCountry={"IL"}
                  value={field.defaultvalue}
                  onChange={(e) => updateFieldValue(field.id, e)}
                />
              )}

              {field.data_type.value === "file" && (
                <label className="text-md flex items-center w-full appearance-none outline-none border border-[#E3E5E6] rounded-lg p-2.5 text-gray-11">
                  <MdOutlineUploadFile
                    style={{
                      marginRight: "5px",
                      fontSize: "1.25rem",
                    }}
                  />
                  {field.defaultvalue}
                  <input
                    type={field.data_type.value}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    hidden
                  />
                </label>
              )}

              {field.data_type.value === "select" && (
                <Select
                  className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                  onChange={
                    (e) => console.log(e)
                    // updateFieldValue(field.id, e)
                  }
                  MenuProps={{
                    sx: {
                      maxHeight: "250px",
                      zIndex: 13000,
                    },
                  }}
                  defaultValue={
                    field.enum_values?.choices?.filter(
                      (item) => item.label === field.defaultvalue
                    )[0]?.label
                  }
                  placeholder="Select"
                >
                  {field.enum_values?.choices?.map((el) => {
                    return el !== "" ? (
                      <MenuItem key={el.id} value={el.label}>
                        {el.label}
                      </MenuItem>
                    ) : null;
                  })}
                </Select>
              )}

              {checkBoxConstants.includes(field.data_type.value) && (
                <CustomCheckBox
                  onChange={(e) => updateFieldValue(field.id, e.target.checked)}
                  checked={field.defaultvalue}
                />
              )}

              {DateFieldConstants.includes(field.data_type.value) && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-0 text-black"
                    format="DD/MM/YYYY"
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    value={dayjs(field.defaultvalue)}
                    slotProps={{
                      field: { clearable: true },
                      popper: {
                        disablePortal: true,
                      },
                    }}
                    sx={{
                      border: 0,
                      "& .MuiInputBase-input": {
                        padding: 1.5,
                        border: "none",
                      },
                      "& fieldset": {
                        borderColor: "inherit!important",
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    setActiveFormState(clientDetailForm);
  }, []);

  return (
    <div className="fixed left-0 bottom-0 z-[9999] h-screen w-screen bg-[#00000080] flex justify-center items-center">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-7xl">
          <div className="scrollbar-hide w-[60vw] h-[35rem] overflow-y-auto border-0 rounded-xl shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between border-b border-b-[#E3E5E6] rounded-t px-4 py-2">
              <h3 className="text-lg font-medium">{t("forms.clientsForm")}</h3>
              <button
                className=""
                onClick={() => setShowModal(false)}
                type="button"
              >
                <img src={CrossIcon} alt="cross-icon" />
              </button>
            </div>

            {/* <div className="bg-[#F9FBFC] rounded-lg m-4 px-4 pt-4">
              <div className="flex items-center gap-2 w-full border-b border-b-[#E3E5E6] pb-4">
                <div className="w-full">
                  <p>{t("forms.client")}</p>
                  <Select
                    labelId="client-select-label"
                    id="client-select"
                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                    disabled
                    value={clientId}
                    MenuProps={{
                      sx: {
                        maxHeight: "250px",
                        zIndex: 13000,
                      },
                    }}
                    onChange={(e) => {}}
                    placeholder="Choose client"
                  >
                    <MenuItem key="select" value="select" disabled>
                      Select
                    </MenuItem>
                  </Select>
                </div>
                <div className="w-full">
                  <p>{t("forms.form")}</p>
                  <Select
                    labelId="form-select-label"
                    id="form-select"
                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                    value={formId}
                    MenuProps={{
                      sx: {
                        maxHeight: "250px",
                        zIndex: 13000,
                      },
                    }}
                    onChange={(e) => {}}
                    placeholder="Choose form"
                    disabled
                  >
                    <MenuItem key="select" value="select">
                      Select
                    </MenuItem>
                  </Select>
                </div>
              </div>
            </div> */}

            <div className="p-4 h-[30rem] overflow-y-scroll scrollbar-hide">
              {activeFormState &&
                Object.keys(activeFormState).length > 0 &&
                activeFormState.blocks.length > 0 && (
                  <Accordion
                    defaultIndex={Array.from(
                      { length: activeFormState.blocks?.length },
                      (x, i) => i
                    )}
                    allowMultiple
                  >
                    {activeFormState.blocks
                      .filter((form) => !form.isRepeatable)
                      .map((blockData, index) => (
                        <CustomAccordion
                          key={index}
                          showAddButton={false}
                          title={blockData.name}
                          onClick={() => {
                            addBlockFieldModalHandler(false, blockData.id);
                          }}
                        >
                          {activeFormState.fields.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                              {activeFormState.fields
                                .filter(
                                  (field) =>
                                    field.clientFormBlockId === blockData.id
                                )
                                .map((field, index) => {
                                  const isCheckBox = checkBoxConstants.includes(
                                    field.data_type.value
                                  );
                                  return (
                                    <div
                                      className="mb-2 px-2 flex flex-col gap-1"
                                      key={index}
                                    >
                                      <div
                                        className={`flex items-center justify-between ${
                                          isCheckBox ? "ml-2 w-full" : "mb-1"
                                        }`}
                                      >
                                        <div className="flex items-center">
                                          <label className="block text-gray-700 text-md font-normal">
                                            {field.name}
                                          </label>
                                          <p className="text-md mx-1 capitalize text-gray-600 font-normal">{`(${field.data_type.value})`}</p>
                                        </div>
                                      </div>
                                      <div>
                                        {TextFieldConstants.includes(
                                          field.data_type.value
                                        ) && (
                                          <input
                                            disabled
                                            type={field.data_type.value}
                                            className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                                            value={field.defaultvalue}
                                            onChange={(e) =>
                                              updateFieldValue(
                                                field.id,
                                                e.target.value
                                              )
                                            }
                                          />
                                        )}

                                        {NumberFieldConstants.includes(
                                          field.data_type.value
                                        ) && (
                                          <input
                                            disabled
                                            type="number"
                                            min="0"
                                            className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                                            value={field.defaultvalue}
                                            onKeyDown={handleNumberkeyPress}
                                            onChange={(e) =>
                                              updateFieldValue(
                                                field.id,
                                                e.target.value
                                              )
                                            }
                                          />
                                        )}

                                        {field.data_type.value === "phone" && (
                                          <PhoneInput
                                            disabled
                                            labels={lang === "en" ? en : he}
                                            className="appearance-none outline-none border border-[#E3E5E6] rounded-lg p-2 text-gray-11 [&>input]:outline-none [&>input]:bg-white placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                                            defaultCountry={"IL"}
                                            value={field.defaultvalue}
                                            onChange={(e) =>
                                              updateFieldValue(field.id, e)
                                            }
                                          />
                                        )}

                                        {field.data_type.value === "file" && (
                                          <label className="text-md flex items-center w-full appearance-none outline-none border border-[#E3E5E6] rounded-lg p-2.5 text-gray-11">
                                            <MdOutlineUploadFile
                                              style={{
                                                marginRight: "5px",
                                                fontSize: "1.25rem",
                                              }}
                                            />
                                            {field.defaultvalue}
                                            <input
                                              disabled
                                              type={field.data_type.value}
                                              onChange={(e) =>
                                                updateFieldValue(
                                                  field.id,
                                                  e.target.value
                                                )
                                              }
                                              hidden
                                            />
                                          </label>
                                        )}

                                        {field.data_type.value === "select" && (
                                          <Select
                                            disabled
                                            className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                                            onChange={
                                              (e) => console.log(e)
                                              // updateFieldValue(field.id, e)
                                            }
                                            MenuProps={{
                                              sx: {
                                                maxHeight: "250px",
                                                zIndex: 13000,
                                              },
                                            }}
                                            defaultValue={
                                              field.enum_values?.choices?.filter(
                                                (item) =>
                                                  item.label ===
                                                  field.defaultvalue
                                              )[0]?.label
                                            }
                                            placeholder="Select"
                                          >
                                            {field.enum_values?.choices?.map(
                                              (el) => {
                                                return el !== "" ? (
                                                  <MenuItem
                                                    key={el.id}
                                                    value={el.label}
                                                  >
                                                    {el.label}
                                                  </MenuItem>
                                                ) : null;
                                              }
                                            )}
                                          </Select>
                                        )}

                                        {checkBoxConstants.includes(
                                          field.data_type.value
                                        ) && (
                                          <CustomCheckBox
                                            disabled={true}
                                            onChange={(e) =>
                                              updateFieldValue(
                                                field.id,
                                                e.target.checked
                                              )
                                            }
                                            checked={field.defaultvalue}
                                          />
                                        )}

                                        {DateFieldConstants.includes(
                                          field.data_type.value
                                        ) && (
                                          <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                          >
                                            <DatePicker
                                              disabled
                                              className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-0 text-black"
                                              format="DD/MM/YYYY"
                                              onChange={(e) =>
                                                updateFieldValue(
                                                  field.id,
                                                  e.target.value
                                                )
                                              }
                                              value={dayjs(field.defaultvalue)}
                                              slotProps={{
                                                field: { clearable: true },
                                                popper: {
                                                  disablePortal: true,
                                                },
                                              }}
                                              sx={{
                                                border: 0,
                                                "& .MuiInputBase-input": {
                                                  padding: 1.5,
                                                  border: "none",
                                                },
                                                "& fieldset": {
                                                  borderColor:
                                                    "inherit!important",
                                                },
                                              }}
                                            />
                                          </LocalizationProvider>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : (
                            <p className="px-2">{t("clients.noFields")}</p>
                          )}
                        </CustomAccordion>
                      ))}

                    {activeFormState.blocks
                      .filter((form) => form.isRepeatable)
                      .map((blockData, index) => (
                        <button
                          className="my-4 border border-solid border-[#E3E5E6] rounded-lg w-full p-3 text-[#0B99FF] flex justify-center items-center gap-2"
                          onClick={() => addRepeatableBlock(blockData.id)}
                        >
                          <img src={AddCircleIcon} alt="add_circle_icon" />
                          <p>
                            {t("forms.add")} {blockData.name}
                          </p>
                        </button>
                      ))}
                  </Accordion>
                )}
            </div>

            {/* {activeFormState &&
              Object.keys(activeFormState).length > 0 &&
              activeFormState.blocks.length > 0 && (
                <div className="mt-4 p-2 flex justify-center items-center">
                  <button
                    disabled={!activeFormState}
                    className={`${
                      lang === "he" ? "w-[150px]" : "w-[170px]"
                    } h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
                    onClick={() => {
                      submitFormHandler();
                    }}
                  >
                    {t("forms.save")}
                  </button>
                </div>
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
