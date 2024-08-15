import React, { useState, useEffect } from "react";
import formsService from "../../../services/forms";
import { useTranslation } from "react-i18next";
import AddIcon from "../../../assets/images/add.svg";
import PencilIcon from "../../../assets/images/white_pencil.svg";
import PinIcon from "../../../assets/pin.svg";
import InfoIcon from "../../../assets/images/circular_info.svg";
import SearchField from "../../fields/SearchField";
import Loader from "../../common/Loader";
import NoDataFound from "../../common/NoDataFound";
import { MenuItem, Select } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import {
  checkBoxConstants,
  DateFieldConstants,
  NumberFieldConstants,
  TextFieldConstants,
} from "../../../lib/FieldConstants";
import en from "react-phone-number-input/locale/en";
import he from "react-phone-number-input/locale/he";
import { MdOutlineUploadFile } from "react-icons/md";
import CustomCheckBox from "../../fields/checkbox";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { handleNumberkeyPress } from "../../../lib/CommonFunctions";
import FormAddVersionModal from "../../forms/FormAddVersionModal";
import CommentAddedSuccessfullyModal from "../../forms/CommentAddedSuccessfullyModal";

export const ClientFormsTabPanel = ({ clientId }) => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [allClientForms, setAllClientForms] = useState([]);
  const [activeFormId, setActiveFormId] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [activeFormCurrentVersion, setActiveFormCurrentVersion] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClientFormModal, setShowClientFormModal] = useState(false);
  const [showFormAddVersionModal, setShowFormAddVersionModal] = useState(false);
  const [
    showCommentAddedSuccessfullyModal,
    setShowCommentAddedSuccessfullyModal,
  ] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [versionComments, setVersionComments] = useState("");

  const fetchFormsData = async () => {
    setIsLoading(true);
    try {
      const allFormsPayload = await formsService.getSingleClientForms(clientId);
      setAllClientForms(allFormsPayload.data);
      setActiveFormId(allFormsPayload.data[0].id);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchFormsDetailsData = async (formId) => {
    try {
      const formDetailPayload = await formsService.getSingleClientFormDetails(
        formId
      );
      if (formDetailPayload.data) {
        setActiveForm(formDetailPayload.data);
        if (formDetailPayload.data.versions.length > 0) {
          setActiveFormCurrentVersion(formDetailPayload.data.versions[0].id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeActiveFormCurrentVersion = (id) => {
    setActiveFormCurrentVersion(id);
  };

  const searchResult = (searchBy, value) => {
    setSearchParams((prev) => ({ ...prev, ...{ [searchBy]: value } }));
  };

  const updateFieldValue = (fieldId, newValue) => {
    setActiveForm((prevState) => {
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

  const saveFormNewVersion = () => {
    setEditMode(false);
    setShowCommentAddedSuccessfullyModal(false);
  };

  // effects
  useEffect(() => {
    const searchTimer = setTimeout(() => fetchFormsData(), 500);
    return () => clearTimeout(searchTimer);
  }, [lang, clientId]);

  useEffect(() => {
    if (activeFormId) {
      fetchFormsDetailsData(activeFormId);
    }
  }, [activeFormId]);

  return (
    <div>
      <div className="flex justify-between items-center py-4 px-7 text-gray-11 font-medium text-2xl">
        {t("forms.allForms")}
        <button
          className={`${
            lang === "he" ? "w-[150px]" : "w-[170px]"
          } h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
          onClick={() => {
            setShowClientFormModal(true);
          }}
        >
          <img src={AddIcon} alt="add_icon" />
          {t("forms.addNewForm")}
        </button>
      </div>

      <div className="h-[20rem] overflow-y-scroll overflow-x-auto mx-5 px-2 border-b-2 border-b-solid border-b-[#BDBDBD]">
        <table className="!table w-full text-[12px] md:text-[14px] mb-3">
          <thead className="sticky top-0 z-10 [&_th]:min-w-[8.5rem] bg-[#F9FBFC]">
            <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
            <tr className="tracking-[-2%] mb-5">
              <th className="pr-3 pl-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("clients.id")}
                  id="userId"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("id", e.target.value)}
                  name="id"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("forms.name")}
                  id="userName"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("name", e.target.value)}
                  name="name"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("forms.clientId")}
                  id="clientId"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("clientId", e.target.value)}
                  name="clientId"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("forms.dateFilledOut")}
                  id="dateFilledOut"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) =>
                    searchResult("dateFilledOut", e.target.value)
                  }
                  name="dateFilledOut"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("forms.datelastEdited")}
                  id="datelastEdited"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) =>
                    searchResult("datelastEdited", e.target.value)
                  }
                  name="datelastEdited"
                />
              </th>
            </tr>
          </thead>

          <tbody className="[&_td]:min-w-[9rem] [&_td]:max-w-[18rem]">
            {isLoading ? (
              <tr>
                <td colSpan="6">
                  <div className="h-[calc(100vh-210px)] w-full flex justify-center items-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {allClientForms && allClientForms.length > 0 ? (
                  <>
                    {allClientForms.map((el) => {
                      return (
                        <tr
                          className={`h-[75px] border-b border-b-[#F2F2F2] cursor-pointer py-12 ${
                            el.isPined ? "bg-[#0B99FF1A]" : ""
                          }`}
                          key={el.id}
                          onClick={() => setActiveFormId(el.id)}
                        >
                          <td>
                            {el.isPined && (
                              <img
                                src={PinIcon}
                                alt="pin-icon"
                                className="inline"
                              />
                            )}{" "}
                            #{el.id}
                          </td>
                          <td>{el.name}</td>
                          <td>#{el.clientId}</td>
                          <td>{el.createdAt}</td>
                          <td>{el.lastEditedAt}</td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <tr className="h-[75px] text-center">
                    <td colSpan={6}>
                      <NoDataFound description={t("common.noDataFound")} />
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {activeForm && Object.keys(activeForm).length > 0 && (
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-b-solid border-b-[#E3E5E6] pb-4">
            <h1 className="text-gray-11 font-medium text-2xl">
              {activeForm.name}
            </h1>
            <div className="flex items-center gap-2">
              {!editMode && (
                <Select
                  className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                  MenuProps={{
                    sx: {
                      maxHeight: "250px",
                      zIndex: 13000,
                    },
                  }}
                  placeholder="Select"
                  defaultValue={activeForm.versions[0].name}
                >
                  {activeForm &&
                    activeForm.versions.map((el) => {
                      return (
                        <MenuItem
                          key={el.id}
                          value={el.name}
                          onClick={() => changeActiveFormCurrentVersion(el.id)}
                        >
                          {el.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              )}
              <button
                className={`${
                  editMode ? "w-[100px]" : "w-[250px]"
                } h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
                onClick={() => {
                  if (!editMode) {
                    setEditMode(true);
                  } else {
                    setShowFormAddVersionModal(true);
                  }
                }}
              >
                {!editMode && <img src={PencilIcon} alt="pencil_icon" />}
                {editMode ? t("forms.save") : t("forms.editForm")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-32 gap-y-4 pt-8 pb-12">
            {!editMode &&
              activeForm.fields.map((field, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-[#5C5C5C]">{field.name}</span>
                  <span className="text-[#1C1C1C]">
                    :
                    {field.defaultvalue === true
                      ? "Yes"
                      : field.defaultvalue === false
                      ? "No"
                      : field.defaultvalue}
                  </span>
                </div>
              ))}

            {editMode &&
              activeForm.fields.map((field, index) => (
                <div key={index} className="flex justify-between">
                  <p className="text-[#5C5C5C]">{field.name}</p>

                  <div>
                    {TextFieldConstants.includes(field.data_type.value) && (
                      <input
                        type={field.data_type.value}
                        className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                        value={field.defaultvalue}
                        onChange={(e) =>
                          updateFieldValue(field.id, e.target.value)
                        }
                      />
                    )}

                    {NumberFieldConstants.includes(field.data_type.value) && (
                      <input
                        type="number"
                        min="0"
                        className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                        value={field.defaultvalue}
                        onKeyDown={handleNumberkeyPress}
                        onChange={(e) =>
                          updateFieldValue(field.id, e.target.value)
                        }
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
                          onChange={(e) =>
                            updateFieldValue(field.id, e.target.value)
                          }
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
                        defaultValue={field.enum_values?.choices[0].label}
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
                        onChange={(e) =>
                          updateFieldValue(field.id, e.target.checked)
                        }
                        checked={field.defaultvalue}
                      />
                    )}

                    {DateFieldConstants.includes(field.data_type.value) && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-0 text-black"
                          format="DD/MM/YYYY"
                          onChange={(e) =>
                            updateFieldValue(field.id, e.target.value)
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
                              borderColor: "inherit!important",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {showFormAddVersionModal && (
        <FormAddVersionModal
          setShowModal={setShowFormAddVersionModal}
          versionName={versionName}
          setVersionName={setVersionName}
          versionComments={versionComments}
          setVersionComments={setVersionComments}
          onClick={() => {
            setShowFormAddVersionModal(false);
            setShowCommentAddedSuccessfullyModal(true);
          }}
        />
      )}

      {showCommentAddedSuccessfullyModal && (
        <CommentAddedSuccessfullyModal onClick={saveFormNewVersion} />
      )}
    </div>
  );
};
