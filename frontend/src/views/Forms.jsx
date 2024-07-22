// React imports
import React, { useState, useEffect, useCallback } from "react";

// UI Imports
import { TablePagination } from "@mui/material";
import { Accordion } from "@chakra-ui/react";

// UI Components Imports
import AddButtonIcon from "../component/common/AddButton";
import SearchField from "../component/fields/SearchField";
import Loader from "../component/common/Loader";
import NoDataFound from "../component/common/NoDataFound";
import UserModal from "../component/Netfree/category/UserModal";
import DeleteConfirmationModal from "../component/common/DeleteConfirmationModal";

// Third part Imports
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// API services
import authService from "../services/auth";
import formsService from "../services/forms";

// Icon imports
import { MdDelete, MdEdit } from "react-icons/md";
import AddIcon from "../assets/images/add.svg";
import BinIcon from "../assets/images/bin.svg";
import PencilIcon from "../assets/images/pencil.svg";
import PinIcon from "../assets/pin.svg";
import RepeatableIcon from "../assets/images/repeat_able_icon.svg";

// Utils imports
import { paginationRowOptions } from "../lib/FieldConstants";
import {
  fetchActiveformDataHandler,
  fetchFullformDataHandler,
} from "../lib/CommonFunctions";
import { Draggable } from "react-drag-reorder";
import { PiDotsSixVerticalBold } from "react-icons/pi";

// UI Components Imports
import BlockButton from "../component/client/BlockButton";
import CustomAccordion from "../component/common/Accordion";
import BlockFieldModal from "../component/client/BlockFieldModal";
import CustomField from "../component/fields/CustomField";
import EditButtonIcon from "../component/common/EditButton";
// API services
import clientsService from "../services/clients";

// Utils imports
import { checkBoxConstants } from "../lib/FieldConstants";
import CustomCheckBox from "../component/fields/checkbox";
import { ACTIVE_FORM } from "../constants";
import FormBlockFieldModal from "../component/forms/FormBlockFieldModal";
import { formatDate } from "../utils/helpers";

function Forms() {
  // states
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(true);
  const [allForms, setAllForms] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [searchParams, setSearchParams] = useState({});
  const [activeBlock, setActiveBlock] = useState(null);
  const [activeFieldId, setActiveFieldId] = useState(null);
  const [isAddBlock, setIsAddBlock] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showFormCreationPage, setShowFormCreationPage] = useState(false);
  const [activeForm, setActiveForm] = useState(ACTIVE_FORM);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [blockDeletionConfirmationModal, setBlockDeletionConfirmationModal] =
    useState(false);
  const [fieldDeletionConfirmationModal, setFieldDeletionConfirmationModal] =
    useState(false);
  const [showModal, setShowModal] = useState(false);

  // handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchFormsData = async () => {
    setIsLoading(true);
    try {
      let searchValues = "";
      for (const searchfield in searchParams) {
        if (searchParams[searchfield] !== "") {
          searchValues += `&search_${[searchfield]}=${
            searchParams[searchfield]
          }`;
        }
      }
      const params = `?page=${
        page + 1
      }&lang=${lang}&page_size=${rowsPerPage}${searchValues}`;
      const requestForms = await formsService.getAllForms(params);
      // setTotalCount(requestForms?.data?.count);
      // setAllForms(requestForms?.data?.data);
      setAllForms(requestForms.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const searchResult = (searchBy, value) => {
    setSearchParams((prev) => ({ ...prev, ...{ [searchBy]: value } }));
  };

  const addBlockFieldModalHandler = (flag, id) => {
    setActiveBlock(id);
    setEditData(null);
    setIsAddBlock(flag);
    setShowModal(true);
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
      const blocksData = JSON.parse(JSON.stringify(activeForm.blocks));
      delete blocksData.fields;
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
      const blockData = activeForm.blocks.filter(
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

  const deleteBlockHandler = () => {
    const newPayload = activeForm;
    newPayload.blocks = newPayload.blocks.filter(
      (block) => block.id !== activeBlock
    );
    localStorage.setItem("activeForm", JSON.stringify(newPayload));
    // TODO: call the API to delete the block
    fetchActiveformDataHandler(setIsLoading, setActiveForm);
  };

  const deleteFieldHandler = () => {
    const newPayload = activeForm;
    newPayload.blocks = newPayload.blocks.map((block) => {
      if (block.id === activeBlock) {
        const newFields = block.fields.filter(
          (field) => field.id !== activeFieldId
        );
        return {
          ...block,
          fields: newFields,
        };
      }
      return block;
    });
    localStorage.setItem("activeForm", JSON.stringify(newPayload));
    // TODO: call the API to delete the field of the block
    fetchActiveformDataHandler(setIsLoading, setActiveForm);
  };

  const submitFormHandler = () => {
    setAllForms((prev) =>
      prev.map((form) => {
        if (form.id === activeForm.id) {
          return activeForm;
        }
        return form;
      })
    );
    setShowFormCreationPage(false);
  };

  // effects
  useEffect(() => {
    const searchTimer = setTimeout(() => fetchFormsData(), 500);
    return () => clearTimeout(searchTimer);
  }, [lang, page, rowsPerPage, JSON.stringify(searchParams)]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-custom">
      {!showFormCreationPage && (
        <>
          <div className="flex justify-between items-center py-4 px-7 text-gray-11 font-medium text-2xl">
            {t("forms.formsManagement")}
            <button
              className={`${
                lang === "he" ? "w-[150px]" : "w-[170px]"
              } h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
              onClick={() => {
                setShowFormCreationPage(true);
                setActiveForm(ACTIVE_FORM);
                localStorage.setItem("activeForm", JSON.stringify(ACTIVE_FORM));
              }}
            >
              <img src={AddIcon} alt="add_icon" />
              {t("forms.createNewForm")}
            </button>
          </div>

          <div className="h-[calc(100vh-210px)] overflow-y-auto overflow-x-auto mx-5 px-2">
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
                      label={t("forms.description")}
                      id="description"
                      type="text"
                      placeholder={t("searchbox.placeHolder")}
                      onChange={(e) =>
                        searchResult("description", e.target.value)
                      }
                      name="description"
                    />
                  </th>

                  <th className="pr-3 pb-2 pt-1">
                    <SearchField
                      variant="auth"
                      extra="mb-2"
                      label={t("forms.dateCreated")}
                      id="dateCreated"
                      type="text"
                      placeholder={t("searchbox.placeHolder")}
                      onChange={(e) =>
                        searchResult("dateCreated", e.target.value)
                      }
                      name="dateCreated"
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

                  <th className="pr-3 pb-2 pt-1">
                    <div
                      className={`-mt-11 ${
                        i18n.dir() === "rtl" ? "text-right" : "text-left"
                      }`}
                    >
                      <label
                        className={`truncate text-gray-11 ml-1.5 font-medium ${
                          lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                      >
                        {t("netfree.actions")}
                      </label>
                    </div>
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
                    {allForms && allForms.length > 0 ? (
                      <>
                        {allForms.map((el) => {
                          return (
                            <tr
                              className="h-[75px] border-b border-b-[#F2F2F2] py-12"
                              key={el.id}
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
                              <td>{el.description}</td>
                              <td>{el.createdAt}</td>
                              <td>{el.lastEditedAt}</td>
                              <td>
                                <div className="h-auto w-full flex items-center justify-center gap-2">
                                  <img
                                    src={PencilIcon}
                                    alt="PencilIcon"
                                    className="hover:cursor-pointer"
                                    onClick={() => {
                                      setShowFormCreationPage(true);
                                      localStorage.setItem(
                                        "activeForm",
                                        JSON.stringify(el)
                                      );
                                      fetchActiveformDataHandler(
                                        setIsLoading,
                                        setActiveForm
                                      );
                                    }}
                                  />
                                  <img
                                    src={BinIcon}
                                    alt="BinIcon"
                                    className="hover:cursor-pointer"
                                    onClick={() => {
                                      setConfirmationModal(true);
                                    }}
                                  />
                                </div>
                              </td>
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

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            rowsPerPageOptions={paginationRowOptions}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {confirmationModal && (
            <DeleteConfirmationModal
              showModal={confirmationModal}
              setShowModal={setConfirmationModal}
              onClick={() => {}}
            />
          )}
        </>
      )}

      {showFormCreationPage && (
        <div className="px-6 py-4">
          <h1 className="text-gray-11 font-medium text-2xl">
            {t("forms.formCreation")}
          </h1>

          {isLoading && <Loader />}

          {!isLoading && (
            <>
              <div className="flex items-center gap-4 my-4">
                <div className="w-full flex flex-col gap-2">
                  <label htmlFor="formName">{t("forms.formName")}</label>
                  <input
                    id="formName"
                    type="text"
                    className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                    value={activeForm.name}
                    onChange={(e) =>
                      setActiveForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="w-full flex flex-col gap-2">
                  <label htmlFor="formDesc">{t("forms.formDesc")}</label>
                  <input
                    id="formDesc"
                    type="text"
                    className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                    value={activeForm.description}
                    onChange={(e) =>
                      setActiveForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-b-solid border-b-[#E0E0E0] pb-2 mb-4">
                <CustomCheckBox
                  checked={activeForm.isPined}
                  onChange={() =>
                    setActiveForm((prev) => ({
                      ...prev,
                      isPined: !prev.isPined,
                    }))
                  }
                />
                <label htmlFor="formDesc">{t("forms.pinForm")}</label>
              </div>

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

                  {activeForm.blocks.length > 0 ? (
                    <div className="border border-[#F2F2F2] rounded-lg p-1">
                      <Draggable
                        onPosChange={(currentPos, newPos) =>
                          getChangedFieldsPos(currentPos, newPos, true)
                        }
                      >
                        {activeForm.blocks.map((blockData, index) => (
                          <BlockButton
                            classes="flex items-center justify-between custom-word-break"
                            key={index}
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
                  {activeForm.blocks.length > 0 && (
                    <Accordion
                      defaultIndex={Array.from(
                        { length: activeForm.blocks?.length },
                        (x, i) => i
                      )}
                      allowMultiple
                    >
                      {!isLoading &&
                        activeForm.blocks.map((blockData, index) => (
                          <CustomAccordion
                            key={index}
                            showAddButton={true}
                            title={blockData.name}
                            onClick={() => {
                              addBlockFieldModalHandler(false, blockData.id);
                            }}
                          >
                            {blockData.fields.length > 0 ? (
                              <div className="flex flex-col gap-4">
                                <Draggable
                                  onPosChange={(currentPos, newPos) =>
                                    getChangedFieldsPos(
                                      currentPos,
                                      newPos,
                                      false,
                                      blockData.id
                                    )
                                  }
                                >
                                  {blockData.fields.map((field, index) => {
                                    const isCheckBox =
                                      checkBoxConstants.includes(
                                        field.data_type.value
                                      );
                                    return (
                                      <div
                                        className={`mb-2 px-2 flex gap-1 ${
                                          isCheckBox
                                            ? "items-center justify-end flex-row-reverse"
                                            : "flex-col"
                                        }`}
                                        key={index}
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
                                            <EditButtonIcon
                                              extra="mr-2"
                                              onClick={() => {
                                                editBlockFieldModalHandler(
                                                  {
                                                    ...field,
                                                    block_id: blockData.id,
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
                                      </div>
                                    );
                                  })}
                                </Draggable>
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
                    blockId={activeBlock}
                    onClick={() => {
                      fetchActiveformDataHandler(setIsLoading, setActiveForm);
                    }}
                    setShowModal={setShowModal}
                    activeForm={activeForm}
                    setActiveForm={setActiveForm}
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
      )}
    </div>
  );
}

export default Forms;
