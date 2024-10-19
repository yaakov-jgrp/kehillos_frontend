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
import DownArrow from "../../../assets/images/down_arrow.svg";
import LeftDisableArrow from "../../../assets/images/left_disable_arrow.svg";
import RightEnableArrow from "../../../assets/images/right_enable_arrow.svg";
import {
  convertDataForShowingClientFormDetails,
  formatDate,
  formatDateString,
} from "../../../utils/helpers";
import CreateClientFormModal from "../../forms/CreateClientFormModal";
import FormAddedSuccessfullyModal from "../../forms/FormAddedSuccessfullyModal";
import CustomAccordion from "../../common/Accordion";
import { toast } from "react-toastify";
import { RiHistoryLine } from "react-icons/ri";
import { Accordion } from "@chakra-ui/react";
import { FieldVersionHistory } from "../../forms/FieldVersionHistory";

export const ClientFormsTabPanel = ({ clientId }) => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const { first_name } = JSON.parse(localStorage.getItem("user_details"));
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
  const [dirtyFields, setDirtyFields] = useState([]);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showVersionDetailBox, setShowVersionDetailBox] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fieldsHistory, setFieldsHistory] = useState({});
  const [currentFieldHistoryArray, setCurrentFieldsHistoryArray] = useState([]);
  const [currentFieldHistoryId, setCurrentFieldsHistoryId] = useState(null);
  const [currentFieldBlockId, setCurrentFieldBlockId] = useState(null);
  const [showFieldHistoryBox, setShowFieldHistoryBox] = useState(false);

  const fetchFormsData = async () => {
    setIsLoading(true);
    try {
      let payload = [];
      const allFormsPayload = await formsService.getSingleClientForms(clientId);
      if (
        allFormsPayload?.data?.results &&
        allFormsPayload.data.results.length > 0
      ) {
        payload = allFormsPayload.data.results.map((clientForm) => ({
          ...clientForm,
          createdAt: formatDate(clientForm.createdAt),
          lastEditedAt: formatDate(clientForm.lastEditedAt),
        }));
        setActiveFormId(payload[0].id);
      }
      setAllClientForms(payload);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      toast.error(JSON.stringify(error));
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
        let payload = convertDataForShowingClientFormDetails(
          formDetailPayload.data
        );
        if (payload.fields.length > 0) {
          setDirtyFields(
            payload.fields.map((field) => ({
              fieldId: field.id,
              name: field.name,
              current: field.defaultvalue,
              previous: field.defaultvalue,
            }))
          );
        }
        if (payload.versions.length > 0) {
          const defaultVersion = payload.versions[0];
          setActiveFormCurrentVersion(defaultVersion);
          const defaultVersionDirtyFieldsIdArray =
            defaultVersion.dirty_fields.map((dirtyField) => dirtyField.fieldId);
          payload.fields = payload.fields.map((field) => {
            if (defaultVersionDirtyFieldsIdArray.includes(field.id)) {
              return {
                ...field,
                defaultvalue: defaultVersion.dirty_fields.find(
                  (dirtyField) => dirtyField.fieldId === field.id
                ).current,
              };
            }
            return field;
          });
          const changedFieldsHistory = {};
          payload.versions.forEach((version) => {
            version.dirty_fields.forEach((dirtyField) => {
              if (changedFieldsHistory.hasOwnProperty(dirtyField.fieldId)) {
                changedFieldsHistory[dirtyField.fieldId].push({
                  ...version,
                  dirty_fields: version.dirty_fields.filter(
                    (item) => item.fieldId === dirtyField.fieldId
                  ),
                });
              } else {
                changedFieldsHistory[dirtyField.fieldId] = [
                  {
                    ...version,
                    dirty_fields: version.dirty_fields.filter(
                      (item) => item.fieldId === dirtyField.fieldId
                    ),
                  },
                ];
              }
            });
          });
          setFieldsHistory(changedFieldsHistory);
        }
        console.log(payload);
        setActiveForm(payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsFieldDirty = (fieldId) => {
    let flag = false;
    if (activeFormCurrentVersion) {
      const activeFormCurrentVersionDirtyFieldsIdArray =
        activeFormCurrentVersion.dirty_fields.map(
          (dirtyField) => dirtyField.fieldId
        );
      flag = activeFormCurrentVersionDirtyFieldsIdArray.includes(fieldId);
    }
    return flag;
  };

  const changeActiveFormCurrentVersion = (payload) => {
    const defaultVersionDirtyFieldsIdArray = payload.dirty_fields.map(
      (dirtyField) => dirtyField.fieldId
    );
    setActiveForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => {
        if (defaultVersionDirtyFieldsIdArray.includes(field.id)) {
          const newDefaultValue = payload.dirty_fields.find(
            (dirtyField) => dirtyField.fieldId === field.id
          ).current;
          return {
            ...field,
            defaultvalue: newDefaultValue,
          };
        }
        return field;
      }),
    }));
    setDirtyFields((prevDirtyFields) =>
      prevDirtyFields.map((dirtyFieldObj) => {
        if (defaultVersionDirtyFieldsIdArray.includes(dirtyFieldObj.fieldId)) {
          const newDefaultValue = payload.dirty_fields.find(
            (dirtyField) => dirtyField.fieldId === dirtyFieldObj.fieldId
          ).current;
          return {
            ...dirtyFieldObj,
            current: newDefaultValue,
            previous: newDefaultValue,
          };
        }
        return dirtyFieldObj;
      })
    );
    setActiveFormCurrentVersion(payload);
    setShowVersionDropdown(false);
    setShowVersionDetailBox(false);
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

      setDirtyFields((prevState) =>
        prevState.map((field) => {
          if (field.fieldId === fieldId) {
            return {
              ...field,
              current: newValue,
            };
          }
          return field;
        })
      );

      return {
        ...prevState,
        fields: updatedFields,
      };
    });
  };

  const closeCommentAddedSuccessfullyModal = async () => {
    setEditMode(false);
    setShowCommentAddedSuccessfullyModal(false);
  };

  const saveFormVersion = async () => {
    try {
      const dirtyFieldsPayload = dirtyFields.filter(
        (dirtyField) => dirtyField.current !== dirtyField.previous
      );
      const newVersionRequestPayload = {
        name: versionName,
        comment: versionComments,
        clientFormId: activeFormId,
        dirty_fields: dirtyFieldsPayload,
      };
      console.log(newVersionRequestPayload);
      const newVersionResponse = await formsService.createNewClientFormVersion(
        newVersionRequestPayload
      );
      await fetchFormsDetailsData(activeFormId);
      setVersionName("");
      setVersionComments("");
      setShowFormAddVersionModal(false);
      setShowCommentAddedSuccessfullyModal(true);
    } catch (error) {
      toast.error(JSON.stringify(error));
      console.log(error);
      setVersionName("");
      setVersionComments("");
      setShowFormAddVersionModal(false);
    }
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
                    {allClientForms.map((el, index) => {
                      return (
                        <tr
                          className={`h-[75px] border-b border-b-[#F2F2F2] cursor-pointer py-12 ${
                            el.id === activeFormId ? "bg-[#0B99FF1A]" : ""
                          }`}
                          key={el.id}
                          onClick={() => {
                            setActiveFormId(el.id);
                            setActiveFormCurrentVersion(null);
                          }}
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
                <div className="relative">
                  {activeFormCurrentVersion && (
                    <div className="w-[240px] flex items-center justify-between px-4 py-[10px] border border-[#E3E5E6] rounded-lg">
                      <p className="text-[#5C5C5C] text-[14px]">
                        {activeFormCurrentVersion.name}
                      </p>
                      <button
                        onClick={() => setShowVersionDropdown((prev) => !prev)}
                      >
                        <img src={DownArrow} alt="down_arrow" />
                      </button>
                    </div>
                  )}

                  {activeForm && activeForm.versions.length > 0 && (
                    <div
                      className={`z-[10000] rounded-lg w-full scrollbar-hide absolute top-12 left-0 bg-white shadow-lg transition-all ease-in-out duration-300 transform ${
                        showVersionDropdown
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      {activeForm.versions.map((el) => {
                        return (
                          <div
                            className="cursor-pointer my-2 p-2 hover:bg-[#F9FBFC] flex items-center justify-between relative"
                            key={el.id}
                            value={el.name}
                            onClick={() => changeActiveFormCurrentVersion(el)}
                          >
                            <div>
                              <p className="text-[#5C5C5C] text-[14px] font-medium">
                                {el.name}
                              </p>
                              <p className="text-[#5C5C5C] text-[14px] font-regular">
                                {formatDateString(el.createdAt)}
                              </p>
                            </div>
                            <img
                              onMouseEnter={() => {
                                setShowVersionDetailBox(true);
                                setActiveFormCurrentVersion(el);
                              }}
                              src={InfoIcon}
                              alt="info_icon"
                              className="relative z-10"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeFormCurrentVersion &&
                    showVersionDetailBox &&
                    showVersionDropdown && (
                      <div
                        onMouseLeave={() => {
                          setShowVersionDetailBox(false);
                        }}
                        className={`z-[10000] w-[370px] rounded-lg scrollbar-hide absolute top-2 ${
                          lang === "he" ? "left-64" : "right-64"
                        } bg-white shadow-lg`}
                      >
                        <div className="bg-[#F9FBFC] p-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[#344054] font-medium text-[14px]">
                              {activeFormCurrentVersion.name}
                            </p>
                            <div className="flex gap-2 items-center">
                              <button>
                                <img
                                  src={`${
                                    lang === "he"
                                      ? RightEnableArrow
                                      : LeftDisableArrow
                                  }`}
                                  alt="Arrow"
                                />
                              </button>
                              <button>
                                <img
                                  src={`${
                                    lang === "he"
                                      ? LeftDisableArrow
                                      : RightEnableArrow
                                  }`}
                                  alt="Arrow"
                                />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-[#000] font-medium text-[14px]">
                              {first_name}
                            </p>
                            <p className="text-[#828282] font-medium text-[14px]">
                              {formatDate(activeFormCurrentVersion.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="p-3">
                          <p className="text-[#000] font-medium text-[14px]">
                            {t("forms.comment")}
                          </p>
                          <p className="text-[#828282] font-medium text-[14px]">
                            {activeFormCurrentVersion.comment}
                          </p>
                        </div>

                        <div className="overflow-y-scroll p-3 h-[10rem]">
                          {activeFormCurrentVersion.dirty_fields.map(
                            (dirtyField) => (
                              <div className="border-b border-b-solid border-b-[#E0E0E0] py-2 flex flex-col gap-2">
                                <div className="flex items-center gap-24">
                                  <p className="text-[#000] font-medium text-[14px]">
                                    {dirtyField?.name
                                      ? `${dirtyField?.name} (Current)`
                                      : "Current"}
                                  </p>
                                  <p className="text-[#828282] font-medium text-[14px]">
                                    :{`${dirtyField.current}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-24">
                                  <p className="text-[#000] font-medium text-[14px]">
                                    {dirtyField?.name
                                      ? `${dirtyField?.name} (Previous)`
                                      : "Previous"}
                                  </p>
                                  <p className="text-[#828282] font-medium text-[14px]">
                                    :{`${dirtyField.previous}`}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
              <button
                className={`${
                  editMode ? "w-[100px]" : "w-[150px]"
                } h-[42px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
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

          <div className="my-4">
            {activeForm.blocks &&
              activeForm.blocks.length > 0 &&
              activeForm.blocks.map((block, index) => (
                <Accordion
                  className="z-10"
                  defaultIndex={Array.from(
                    { length: activeForm?.blocks?.length },
                    (x, i) => i
                  )}
                  allowMultiple
                >
                  <CustomAccordion
                    key={`${block.name}-${index}`}
                    showAddButton={false}
                    title={block.name}
                  >
                    <div
                      className={`grid grid-cols-2 gap-x-32 gap-y-4 px-2 ${
                        showFieldHistoryBox && currentFieldBlockId === block.id
                          ? "pt-8 pb-44"
                          : "pt-8 pb-12"
                      }`}
                    >
                      {activeForm.fields
                        .filter((field) => field.clientFormBlockId === block.id)
                        .map((field, index) =>
                          editMode ? (
                            <div key={index} className="flex justify-between">
                              <p className="text-[#5C5C5C]">{field.name}</p>

                              <div>
                                {TextFieldConstants.includes(
                                  field.data_type.value
                                ) && (
                                  <input
                                    type={field.data_type.value}
                                    className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                                    value={field.defaultvalue}
                                    onChange={(e) =>
                                      updateFieldValue(field.id, e.target.value)
                                    }
                                  />
                                )}

                                {NumberFieldConstants.includes(
                                  field.data_type.value
                                ) && (
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
                                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                                    onChange={(e) => {
                                      updateFieldValue(
                                        field.id,
                                        e.target.value
                                      );
                                    }}
                                    MenuProps={{
                                      sx: {
                                        maxHeight: "250px",
                                        zIndex: 13000,
                                      },
                                    }}
                                    defaultValue={
                                      field.enum_values?.choices[0].label
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

                                {checkBoxConstants.includes(
                                  field.data_type.value
                                ) && (
                                  <CustomCheckBox
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
                                      className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-0 text-black"
                                      format="DD/MM/YYYY"
                                      onChange={(value) => {
                                        updateFieldValue(field.id, value);
                                      }}
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
                          ) : (
                            <div
                              key={index}
                              className="flex justify-between relative"
                            >
                              <span className="text-[#5C5C5C] flex items-center gap-2">
                                {checkIsFieldDirty(field.id) && (
                                  <div
                                    className="cursor-pointer"
                                    onMouseEnter={() => {
                                      setCurrentFieldsHistoryId(field.id);
                                      setCurrentFieldBlockId(
                                        field.clientFormBlockId
                                      );
                                      setShowFieldHistoryBox(true);
                                      setCurrentFieldsHistoryArray(
                                        fieldsHistory[field.id]
                                      );
                                    }}
                                  >
                                    <RiHistoryLine color="#000" />
                                  </div>
                                )}
                                {field.name}
                              </span>
                              <span className="text-[#1C1C1C]">
                                :
                                {field.defaultvalue === true
                                  ? "Yes"
                                  : field.defaultvalue === false
                                  ? "No"
                                  : field.defaultvalue}
                              </span>
                              {showFieldHistoryBox &&
                                field.id === currentFieldHistoryId && (
                                  <FieldVersionHistory
                                    formVersionsArray={currentFieldHistoryArray}
                                    setShowFieldHistoryBox={
                                      setShowFieldHistoryBox
                                    }
                                  />
                                )}
                            </div>
                          )
                        )}
                    </div>
                  </CustomAccordion>
                </Accordion>
              ))}
          </div>
        </div>
      )}

      {showClientFormModal && (
        <CreateClientFormModal
          setShowModal={setShowClientFormModal}
          setShowSuccessModal={setShowSuccessModal}
          clientId={clientId}
        />
      )}

      {showSuccessModal && (
        <FormAddedSuccessfullyModal
          onClick={async () => {
            setShowSuccessModal(false);
            await fetchFormsData();
          }}
        />
      )}

      {showFormAddVersionModal && (
        <FormAddVersionModal
          setShowModal={setShowFormAddVersionModal}
          versionName={versionName}
          setVersionName={setVersionName}
          versionComments={versionComments}
          setVersionComments={setVersionComments}
          onClick={() => {
            saveFormVersion();
          }}
        />
      )}

      {showCommentAddedSuccessfullyModal && (
        <CommentAddedSuccessfullyModal
          onClick={closeCommentAddedSuccessfullyModal}
        />
      )}
    </div>
  );
};
