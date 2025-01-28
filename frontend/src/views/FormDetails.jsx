// React and React Router Imports imports
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// UI Imports
import { MenuItem, Select, TablePagination } from "@mui/material";
import { Accordion } from "@chakra-ui/react";

// UI Components Imports
import AddButtonIcon from "../component/common/AddButton";
import DeleteConfirmationModal from "../component/common/DeleteConfirmationModal";

// Third part Imports
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// API services
import formsService from "../services/forms";

// Icon imports
import { MdDelete, MdEdit } from "react-icons/md";
import AddIcon from "../assets/images/add.svg";
import BinIcon from "../assets/images/bin.svg";
import PencilIcon from "../assets/images/pencil.svg";
import PinIcon from "../assets/pin.svg";
import RepeatableIcon from "../assets/images/repeat_able_icon.svg";
import CopyIcon from "../assets/images/copy_icon.svg";
import ConditionsIcon from "../assets/images/condition_icon.svg";
import ConditionsIconGreen from "../assets/images/condition_icon_green.svg";

import { IoIosAdd } from "react-icons/io";

// Utils imports
import { fetchActiveformDataHandler } from "../lib/CommonFunctions";
import { Draggable } from "react-drag-reorder";
import { PiDotsSixVerticalBold } from "react-icons/pi";

// UI Components Imports
import BlockButton from "../component/client/BlockButton";
import CustomAccordion from "../component/common/Accordion";
import CustomField from "../component/fields/CustomField";
import EditButtonIcon from "../component/common/EditButton";

// Utils imports
import { checkBoxConstants } from "../lib/FieldConstants";
import CustomCheckBox from "../component/fields/checkbox";
import { ACTIVE_FORM, FORM_FIELD_CONDITIONS } from "../constants";
import FormBlockFieldModal from "../component/forms/FormBlockFieldModal";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveFormDescription,
  setActiveFormName,
  setActiveFormPinStatus,
  setActiveForm as setActiveFormState,
  setBlocks,
  setConditions,
  setFields,
} from "../redux/activeFormSlice";
import Loader from "../component/common/Loader";
import { setAllFormsState } from "../redux/allFormsSlice";
import {
  isFloat,
  transformFormDataForAddNewForm,
  transformFormDataForUpdate,
} from "../utils/helpers";
import formService from "../services/forms";

function FormDetails() {
  // states
  const activeFormState = useSelector((state) => state.activeForm);
  const allForms = useSelector((state) => state.allFormsState.allForms);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const [activeFieldId, setActiveFieldId] = useState(null);
  const [isAddBlock, setIsAddBlock] = useState(false);
  const [editData, setEditData] = useState(null);
  const [blockDeletionConfirmationModal, setBlockDeletionConfirmationModal] =
    useState(false);
  const [fieldDeletionConfirmationModal, setFieldDeletionConfirmationModal] =
    useState(false);
  const [showModal, setShowModal] = useState(false);

  // handlers
  const addBlockFieldModalHandler = (flag, id) => {
    setActiveBlock(id);
    setEditData(null);
    setIsAddBlock(flag);
    setShowModal(true);
  };
  const duplicateFieldHandler = (field) => {
    const newField = {
      ...field,
      id: Math.random() + Date.now(),
      name: `${field.name} (Copy)`,
    };
  
    const newConditions = activeFormState.conditions
      .filter((condition) => condition.fieldId === field.id)
      .map((condition) => ({
        ...condition,
        id: Math.random() + Date.now(),
        fieldId: newField.id,
      }));
  
    dispatch(setFields([...activeFormState.fields, newField]));
    dispatch(setConditions([...activeFormState.conditions, ...newConditions]));
  };
  
  const editBlockFieldModalHandler = (data, isBlock) => {
    let editableData = JSON.parse(JSON.stringify(data));
    setIsAddBlock(isBlock);
    setEditData(editableData);
    setShowModal(true);
  };

  const orderChangeHandler = (curr, now, items, isBlock) => {
    const reorderedItems = items;
    const draggedItem = reorderedItems[curr];
    reorderedItems.splice(curr, 1);
    reorderedItems.splice(now, 0, draggedItem);
    const updated = reorderedItems.map((item, index) => {
      return {
        id: item.id,
        display_order: index + 1,
      };
    });
    return updated;
  };

  const getChangedFieldsPos = async (currentPos, newPos, isBlock, blockId) => {
    let updatedData;
    if (isBlock) {
      const blocksData = JSON.parse(JSON.stringify(activeFormState.blocks));
      const updateFields = orderChangeHandler(
        currentPos,
        newPos,
        blocksData,
        true
      );
      // Update the order attribute based on the new order
      updatedData = {
        fields: updateFields,
        is_block: true,
      };
      console.log("Here are the updated blocks: ");
    } else {
      const blockData = activeFormState.blocks.filter(
        (block) => block.id === blockId
      );
      const updateFields = orderChangeHandler(
        currentPos,
        newPos,
        blockData[0].fields,
        false
      );
      // Update the order attribute based on the new order
      updatedData = {
        fields: updateFields,
        is_block: false,
      };
      console.log("Here are the updated fields: ");
    }
    console.log(updatedData);
    // call your own API for updating the position of the blocks or fields
    // const res = await clientsService.updateBlockField(updatedData);
  };

  const deleteBlockHandler = async () => {
    if (!isFloat(activeBlock)) {
      await formService.deleteBlock(activeBlock);
    }
    dispatch(
      setBlocks(
        activeFormState.blocks.filter((block) => block.id !== activeBlock)
      )
    );
    dispatch(
      setConditions(
        activeFormState.conditions.filter(
          (condition) =>
            !activeFormState.fields
              .filter((field) => field.blockId === activeBlock)
              .map((field) => field.id)
              .includes(condition.fieldId)
        )
      )
    );
    dispatch(
      setFields(
        activeFormState.fields.filter((field) => field.blockId !== activeBlock)
      )
    );
    fetchActiveformDataHandler(setIsLoading);
  };

  const deleteFieldHandler = async () => {
    if (!isFloat(activeFieldId)) {
      await formService.deleteField(activeFieldId);
    }
    dispatch(
      setFields(
        activeFormState.fields.filter((field) => field.id !== activeFieldId)
      )
    );
    dispatch(
      setConditions(
        activeFormState.conditions.filter(
          (condition) => condition.fieldId !== activeFieldId
        )
      )
    );
  };

  const addFieldConditionHandler = async (fieldId, operator) => {
    const lastField = activeFormState.fields[activeFormState.fields.length - 1]?.name

    if (!isFloat(fieldId)) {
      console.log("Calling API for adding a condition.");
      const newCondition = await formService.createNewCondition({
        fieldId,
        field: "-",
        condition: "equals",
        value: "-",
        operator,
      });
      dispatch(
        setConditions([...activeFormState.conditions, newCondition.data])
      );
    } else {
      dispatch(
        setConditions([
          ...activeFormState.conditions,
          {
            fieldId,
            id: Math.random() + Date.now(),
            field: lastField || "",
            condition: "",
            value: "",
            operator,
          },
        ])
      );
    }
    
  };

  const editFieldConditionHandler = (conditionId, key, value) => {
    dispatch(
      setConditions(
        activeFormState.conditions.map((condition) => {
          if (condition.id === conditionId) {
            return {
              ...condition,
              [key]: value,
            };
          }
          return condition;
        })
      )
    );
  };

  const deleteFieldConditionHandler = async (conditionId) => {
    if (!isFloat(conditionId)) {
      console.log("Deleting condition by calling API.");
      await formsService.deleteCondition(conditionId);
    }
    dispatch(
      setConditions(
        activeFormState.conditions.filter(
          (condition) => condition.id !== conditionId
        )
      )
    );
  };

  const submitFormHandler = async () => {
    try {
      if (!id) {
        const reqPaylaod = transformFormDataForAddNewForm(activeFormState);
        const createNewForm = await formsService.createNewForm(reqPaylaod);
        console.log("Create new form API returned the below payload..... ");
        console.log(createNewForm.data);
        dispatch(setAllFormsState([...allForms, activeFormState]));
      } else {
        console.log("The final form payload for update form is: ");
        const payload = transformFormDataForUpdate(activeFormState);
        console.log(payload);
        const updatedForm = await formService.updateForm(id, payload);
        console.log("The updated form data from API is:");
        console.log(updatedForm.data);
        // dispatch(
        //   setAllFormsState(
        //     allForms.map((form) => {
        //       if (form.id === Number(id)) {
        //         return activeFormState;
        //       }
        //       return form;
        //     })
        //   )
        // );
      }
      navigate("/settings/forms");
    } catch (error) {
      toast.error(JSON.stringify(error));
      console.log(error);
    }
  };

  const toggleFieldConditionDisplay = (fieldId) => {
    const newActiveFormFields = activeFormState.fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          isConditionShown: !field.isConditionShown,
        };
      }
      return field;
    });
    dispatch(setFields(newActiveFormFields));
  };

  // effects
  useEffect(() => {
    const fetchActiveFormHandler = async () => {
      const activeFormPayload = JSON.parse(localStorage.getItem("activeForm"));
      if (activeFormPayload) {
        const newActiveFormPayload = { ...activeFormPayload };
        newActiveFormPayload.fields = newActiveFormPayload.fields.map(
          (field) => ({ ...field, isConditionShown: false })
        );
        dispatch(setActiveFormState(newActiveFormPayload));
      } else {
        dispatch(setActiveFormState(ACTIVE_FORM));
      }
    };

    fetchActiveFormHandler();
  }, [id]);

 

  return (
    <div className="w-full bg-white rounded-3xl shadow-custom">
      <div className="px-6 py-4">
        <h1 className="text-gray-11 font-medium text-2xl">
          {t("forms.formCreation")}
        </h1>

        <div className="flex items-center gap-4 my-4">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="formName">{t("forms.formName")}</label>
            <input
              id="formName"
              type="text"
              className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
              value={activeFormState.name}
              onChange={(e) =>
                dispatch(setActiveFormName({ name: e.target.value }))
              }
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="formDesc">{t("forms.formDesc")}</label>
            <input
              id="formDesc"
              type="text"
              className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
              value={activeFormState.description}
              onChange={(e) =>
                dispatch(
                  setActiveFormDescription({ description: e.target.value })
                )
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-b-solid border-b-[#E0E0E0] pb-2 mb-4">
          <CustomCheckBox
            checked={activeFormState.isPined}
            onChange={() =>
              dispatch(
                setActiveFormPinStatus({ isPined: !activeFormState.isPined })
              )
            }
          />
          <label htmlFor="formDesc">{t("forms.pinForm")}</label>
        </div>

        {isLoading && <Loader />}

        {!isLoading && (
          <>
            <div className="flex overflow-y-auto overflow-x-auto gap-8">
              <div className="flex-[0.3]">
                <h5 className="text-start text-[12px] py-2 md:text-[20px] font-medium text-gray-11 w-[100%] flex items-center justify-between border-b border-[#F2F2F2] mb-4">
                  {t("clients.blocks")}
                  <AddButtonIcon
                    onClick={() => {
                      addBlockFieldModalHandler(true, null);
                    }}
                  />
                </h5>

                {activeFormState?.blocks?.length > 0 ? (
                  <div className="border border-[#F2F2F2] rounded-lg p-1">
                    <Draggable
                      onPosChange={(currentPos, newPos) =>
                        getChangedFieldsPos(currentPos, newPos, true)
                      }
                    >
                      {activeFormState.blocks.map((blockData, index) => (
                        <BlockButton
                          classes="flex items-center justify-between custom-word-break"
                          key={blockData.id}
                          onClick={() => setActiveBlock(blockData.id)}
                        >
                          {blockData.name}
                          <div className="flex items-center">
                            {blockData.isRepeatable && (
                              <div className="mr-2">
                                <img
                                  src={RepeatableIcon}
                                  alt="repeatable-icon"
                                />
                              </div>
                            )}
                            <EditButtonIcon
                              extra="mr-2"
                              onClick={() => {
                                editBlockFieldModalHandler(
                                  {
                                    name: blockData.name,
                                    isRepeatable: blockData.isRepeatable,
                                  },
                                  true
                                );
                              }}
                            />
                            <img
                              src={BinIcon}
                              alt="BinIcon"
                              className="mr-2 hover:cursor-pointer"
                              onClick={() =>
                                setBlockDeletionConfirmationModal(true)
                              }
                            />
                            <PiDotsSixVerticalBold className="cursor-grab z-20" />
                          </div>
                        </BlockButton>
                      ))}
                    </Draggable>
                  </div>
                ) : (
                  <p>{t("clients.noSections")}</p>
                )}
              </div>

              <div className="flex-[0.7]">
                <h5 className="text-start flex items-center justify-between text-[12px] py-2 md:text-[20px] font-medium text-gray-11 w-[100%] border-b border-[#F2F2F2] mb-4">
                  {t("clients.fields")}
                </h5>
                {activeFormState.blocks.length > 0 && (
                  <Accordion
                    defaultIndex={Array.from(
                      { length: activeFormState.blocks?.length },
                      (x, i) => i
                    )}
                    allowMultiple
                  >
                    {activeFormState.blocks.map((blockData, index) => (
                      <CustomAccordion
                        key={index}
                        showAddButton={true}
                        title={blockData.name}
                        onClick={() => {
                          addBlockFieldModalHandler(false, blockData.id);
                        }}
                      >
                        {activeFormState.fields.length > 0 ? (
                          <div className="flex flex-wrap gap-y-4">
                            {activeFormState.fields
                              .filter((field) => field.blockId === blockData.id)
                              .map((field, index) => {
                                const isCheckBox = checkBoxConstants.includes(
                                  field.data_type.value
                                );
                                const hasConditions = activeFormState.conditions.some(
                                  (condition) => condition.fieldId === field.id
                                );
                                return (
                                  <div
                                    className={`mb-2 px-2 flex gap-1 flex-col`}
                                    key={index}
                                    style={{
                                      width: field?.field_width_percentage
                                        ? `${field?.field_width_percentage}%`
                                        : "100%",
                                    }} 
                                  >
                                    <div
                                      className={`flex items-center justify-between ${
                                        isCheckBox ? "ml-2 w-full" : "mb-1"
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        <label
                                          className={`block text-gray-11 text-md font-normal`}
                                        >
                                          {field.name}
                                        </label>
                                        <p className="text-md mx-1 capitalize text-gray-10 font-normal">{`(${field.data_type.value})`}</p>
                                      </div>
                                      <div className="flex items-center">
                                        <button
                                          onClick={() =>
                                            toggleFieldConditionDisplay(
                                              field.id
                                            )
                                          }
                                        >
                                          <img
                                            className="cursor-pointer mr-2"
                                            // src={ConditionsIcon}
                                            src={hasConditions ? ConditionsIconGreen : ConditionsIcon}
                
                                            alt="conditions_icon"
                                          />
                                        </button>
                                        <img
                                          className="cursor-pointer mr-2"
                                          src={CopyIcon}
                                          alt="copy_icon"
                                          onClick={() =>
                                            duplicateFieldHandler(field)
                                          }
                                        />
                                        <EditButtonIcon
                                          extra="mr-2"
                                          onClick={() => {
                                            editBlockFieldModalHandler(
                                              {
                                                ...field,
                                                blockId: blockData.id,
                                              },
                                              false
                                            );
                                          }}
                                        />
                                        <img
                                          src={BinIcon}
                                          alt="BinIcon"
                                          className="mr-2 hover:cursor-pointer"
                                          onClick={() => {
                                            setActiveBlock(blockData.id);
                                            setActiveFieldId(field.id);
                                            setFieldDeletionConfirmationModal(
                                              true
                                            );
                                          }}
                                        />
                                        <PiDotsSixVerticalBold className="cursor-grab z-20" />
                                      </div>
                                    </div>
                                    <div>
                                      <CustomField
                                        disabled={true}
                                        value={field?.defaultvalue}
                                        field={field}
                                      />
                                    </div>

                                    {field.isConditionShown && (
                                      <div>
                                        {/* Conditions Heading */}
                                        <p className="font-medium my-2">
                                          {t("forms.conditions")}
                                        </p>

                                        {/* AND Conditions */}
                                        <div>
                                          <p className="my-4">
                                            {t("forms.conditions_message_1")}
                                          </p>

                                          {activeFormState.conditions
                                            .filter(
                                              (condition) =>
                                                condition.fieldId ===
                                                  field.id &&
                                                condition.operator === "AND"
                                            )
                                            .map((condition) => (
                                              <div
                                                className="flex items-end gap-4 my-4"
                                                key={condition.id}
                                              >
                                                <div className="w-full">
                                                  <p>{t("forms.field")}</p>
                                                  <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                                                    value={condition.field}
                                                    MenuProps={{
                                                      sx: {
                                                        maxHeight: "250px",
                                                      },
                                                    }}
                                                    onChange={(e) => {
                                                      editFieldConditionHandler(
                                                        condition.id,
                                                        "field",
                                                        e.target.value
                                                      );
                                                    }}
                                                  >
                                                    <MenuItem value="" disabled>
                                                      Select
                                                    </MenuItem>
                                                    {activeFormState.fields
                                                      .filter(
                                                        (fieldObj) =>
                                                          fieldObj.blockId ===
                                                            blockData.id &&
                                                          fieldObj.id !==
                                                            field.id
                                                      )
                                                      .map(
                                                        (fieldObj, index) => (
                                                          <MenuItem
                                                            key={index}
                                                            value={
                                                              fieldObj.name
                                                            }
                                                          >
                                                            {fieldObj.name}
                                                          </MenuItem>
                                                        )
                                                      )}
                                                  </Select>
                                                </div>
                                                <div className="w-full">
                                                  <p>{t("forms.condition")}</p>
                                                  <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                                                    value={condition.condition}
                                                    MenuProps={{
                                                      sx: {
                                                        maxHeight: "250px",
                                                      },
                                                    }}
                                                    onChange={(e) =>
                                                      editFieldConditionHandler(
                                                        condition.id,
                                                        "condition",
                                                        e.target.value
                                                      )
                                                    }
                                                  >
                                                    <MenuItem value="" disabled>
                                                      Select
                                                    </MenuItem>
                                                    {FORM_FIELD_CONDITIONS.other.map(
                                                      (condition, index) => (
                                                        <MenuItem
                                                          key={index}
                                                          value={condition.slug}
                                                        >
                                                         {lang === "he" ? condition.name.he : condition.name.en}
                                                        </MenuItem>
                                                      )
                                                    )}
                                                  </Select>
                                                </div>
                                                <div className="w-full">
                                                  
                                                  <input
                                                  id={condition.id}
                                                    className="pl-2 appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full py-[10px] text-gray-11 font-normal"
                                                    value={condition.value}
                                                    placeholder={t(
                                                      "forms.value_placeholder"
                                                    )}
                                                    disabled={condition.condition === "is_empty" || condition.condition === "is_not_empty"}
                                                    onChange={(e) =>
                                                      editFieldConditionHandler(
                                                        condition.id,
                                                        "value",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </div>
                                                <div className="my-3">
                                                  <img
                                                    src={BinIcon}
                                                    alt="BinIcon"
                                                    className="mx-1 self-center text-blueSecondary h-[22px] w-[64px] hover:cursor-pointer"
                                                    onClick={() =>
                                                      deleteFieldConditionHandler(
                                                        condition.id
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          <button
                                            className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
                                            onClick={() =>
                                              addFieldConditionHandler(
                                                field.id,
                                                "AND"
                                              )
                                            }
                                          >
                                            <IoIosAdd
                                              style={{ color: "#0B99FF" }}
                                              size="1.5rem"
                                            />
                                            {t("clients.addCondition")}
                                          </button>
                                        </div>

                                        {/* dividing border */}
                                        <div className="border border-b border-[#E3E5E6] my-6"></div>

                                        {/* OR Conditions */}
                                        <div>
                                          <p className="my-4">
                                            {t("forms.conditions_message_2")}
                                          </p>
                                          {activeFormState.conditions
                                            .filter(
                                              (condition) =>
                                                condition.fieldId ===
                                                  field.id &&
                                                condition.operator === "OR"
                                            )
                                            .map((condition) => (
                                              <div
                                                className="flex items-end gap-4 my-4"
                                                key={condition.id}
                                              >
                                                <div className="w-full">
                                                  <p>{t("forms.field")}</p>
                                                  <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                                                    // value={condition.field}
                                                    value={condition.field}
                                                    MenuProps={{
                                                      sx: {
                                                        maxHeight: "250px",
                                                      },
                                                    }}
                                                    onChange={(e) =>
                                                      editFieldConditionHandler(
                                                        condition.id,
                                                        "field",
                                                        e.target.value
                                                      )
                                                    }
                                                  >
                                                    <MenuItem value="" disabled>
                                                      Select
                                                    </MenuItem>
                                                    {activeFormState.fields
                                                      .filter(
                                                        (fieldObj) =>
                                                          fieldObj.blockId ===
                                                            blockData.id &&
                                                          fieldObj.id !==
                                                            field.id
                                                      )
                                                      .map(
                                                        (fieldObj, index) => (
                                                          <MenuItem
                                                            key={index}
                                                            value={
                                                              fieldObj.name
                                                            }
                                                          >
                                                            {fieldObj.name}
                                                          </MenuItem>
                                                        )
                                                      )}
                                                  </Select>
                                                </div>
                                                <div className="w-full">
                                                  <p>{t("forms.condition")}</p>
                                                  <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border border-[#E3E5E6] rounded-lg outline-none w-full p-2 text-gray-11 bg-white"
                                                    value={condition.condition}
                                                    MenuProps={{
                                                      sx: {
                                                        maxHeight: "250px",
                                                      },
                                                    }}
                                                    onChange={(e) =>
                                                      editFieldConditionHandler(
                                                        condition.id,
                                                        "condition",
                                                        e.target.value
                                                      )
                                                    }
                                                  >
                                                    <MenuItem value="" disabled>
                                                      Select
                                                    </MenuItem>
                                                    {FORM_FIELD_CONDITIONS.other.map(
                                                      (condition, index) => (
                                                        <MenuItem
                                                          key={index}
                                                          value={condition.slug}
                                                        >
                                                           {lang === "he" ? condition.name.he : condition.name.en}
                                                        </MenuItem>
                                                      )
                                                    )}
                                                  </Select>
                                                </div>
                                                <div className="w-full">
                                                  <input
                                                    className="pl-2 appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full py-[10px] text-gray-11 font-normal"
                                                    value={condition.value}
                                                    disabled={condition.condition === "is_empty" || condition.condition === "is_not_empty"}
                                                    placeholder={t(
                                                      "forms.value_placeholder"
                                                    )}
                                                    onChange={(e) =>
                                                      editFieldConditionHandler(
                                                        condition.id,
                                                        "value",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                </div>
                                                <div className="my-3">
                                                  <img
                                                    src={BinIcon}
                                                    alt="BinIcon"
                                                    className="mx-1 self-center text-blueSecondary h-[22px] w-[64px] hover:cursor-pointer"
                                                    onClick={() =>
                                                      deleteFieldConditionHandler(
                                                        condition.id
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            ))}

                                          <button
                                            className="w-fit h-[40px] px-4 rounded-lg flex cursor-pointer items-center text-brand-500 font-normal text-md border border-brand-500"
                                            onClick={() =>
                                              addFieldConditionHandler(
                                                field.id,
                                                "OR"
                                              )
                                            }
                                          >
                                            <IoIosAdd
                                              style={{ color: "#0B99FF" }}
                                              size="1.5rem"
                                            />
                                            {t("clients.addCondition")}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <p className="px-2">{t("clients.noFields")}</p>
                        )}
                      </CustomAccordion>
                    ))}
                  </Accordion>
                )}
              </div>

              {showModal && (
                <FormBlockFieldModal
                  editData={editData}
                  block={isAddBlock}
                  formId={id ?? activeFormState.id}
                  blockId={activeBlock}
                  onClick={() => {
                    fetchActiveformDataHandler(setIsLoading);
                  }}
                  setShowModal={setShowModal}
                />
              )}

              {blockDeletionConfirmationModal && (
                <DeleteConfirmationModal
                  showModal={blockDeletionConfirmationModal}
                  setShowModal={setBlockDeletionConfirmationModal}
                  onClick={() => {
                    deleteBlockHandler();
                    setBlockDeletionConfirmationModal(false);
                  }}
                />
              )}

              {fieldDeletionConfirmationModal && (
                <DeleteConfirmationModal
                  showModal={fieldDeletionConfirmationModal}
                  setShowModal={setFieldDeletionConfirmationModal}
                  onClick={() => {
                    deleteFieldHandler();
                    setFieldDeletionConfirmationModal(false);
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-center my-4">
              <button
                className="text-white text-[14px] text-sm font-normal transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 w-[136px] py-[9px] rounded-lg focus:outline-none"
                type="button"
                onClick={submitFormHandler}
              >
                {t("forms.submit")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FormDetails;
