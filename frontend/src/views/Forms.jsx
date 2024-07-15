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

// Utils imports
import { paginationRowOptions } from "../lib/FieldConstants";
import { fetchFullformDataHandler } from "../lib/CommonFunctions";
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

function Forms() {
  // states
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const userTypes = [
    {
      label: t("users.admin"),
      value: "super_user",
    },
    {
      label: t("users.normal"),
      value: "normal_user",
    },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [userModal, setUserModal] = useState(false);
  const [newUser, setNewUser] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [allForms, setAllForms] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [searchParams, setSearchParams] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [fullFormData, setFullFormData] = useState(null);
  const [activeBlock, setActiveBlock] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isAddBlock, setIsAddBlock] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteMethod, setDeleteMethod] = useState({
    type: "",
    value: "",
  });

  // new states
  const [showFormCreationPage, setShowFormCreationPage] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isFormPined, setIsFormPined] = useState(false);

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

  const editUserHandler = (user) => {
    setNewUser(false);
    setEditUser(user);
    setUserModal(true);
  };

  const deleteUserHandler = async () => {
    try {
      const res = await authService.deleteUser(editUser?.id);
      if (res.status > 200) {
        toast.success(t("common.deleteSuccess"));
        fetchFormsData();
        setConfirmationModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModalHandler = () => {
    setShowModal(!showModal);
  };

  const addBlockFieldModalHandler = (value, id) => {
    setEditData(null);
    setIsAddBlock(value);
    showModalHandler();
    activeBlockHandler(id);
  };

  const activeBlockHandler = useCallback((value) => {
    setActiveBlock(value);
  }, []);

  const deleteBlockFieldHandler = async (id, isBlock) => {
    const formData = {
      id: id,
      is_block: isBlock,
    };
    const res = await clientsService.deleteBlockField(formData);
    toast.success(t("common.deleteSuccess"));
    setConfirmationModal(false);
    fetchFullformDataHandler(setIsLoading, setFullFormData);
  };

  const editBlockFieldModalHandler = (data, isBlock) => {
    let editableData = JSON.parse(JSON.stringify(data));
    if (isBlock) {
      delete editableData["field"];
    }
    setIsAddBlock(isBlock);
    setEditData(editableData);
    showModalHandler();
  };

  const orderChangeHandler = (curr, now, items, isBlock) => {
    const reorderedItems = items;
    const draggedItem = reorderedItems[curr];
    reorderedItems.splice(curr, 1);
    reorderedItems.splice(now, 0, draggedItem);
    const updated = reorderedItems.map((item, index) => {
      return {
        id: isBlock ? item.block_id : item.id,
        display_order: index + 1,
      };
    });
    return updated;
  };

  const getChangedFieldsPos = async (currentPos, newPos, isBlock, blockId) => {
    let updatedData;
    if (isBlock) {
      const blocksData = JSON.parse(JSON.stringify(fullFormData));
      delete blocksData.field;
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
    } else {
      const blockData = fullFormData.filter(
        (block) => block.block_id === blockId
      );
      const updateFields = orderChangeHandler(
        currentPos,
        newPos,
        blockData[0].field,
        false
      );
      // Update the order attribute based on the new order
      updatedData = {
        fields: updateFields,
      };
    }
    const res = await clientsService.updateBlockField(updatedData);
  };

  // effects
  useEffect(() => {
    fetchFullformDataHandler(setIsLoading, setFullFormData);
  }, [fetchFullformDataHandler, lang]);

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
                setEditForm(null);
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
                                      setEditForm(null);
                                    }}
                                  />
                                  <img
                                    src={BinIcon}
                                    alt="BinIcon"
                                    className="hover:cursor-pointer"
                                    onClick={() => {
                                      setEditUser(el);
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

          {confirmationModal && editUser && (
            <DeleteConfirmationModal
              showModal={confirmationModal}
              setShowModal={setConfirmationModal}
              onClick={() => deleteUserHandler()}
            />
          )}
        </>
      )}

      {showFormCreationPage && (
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
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="formDesc">{t("forms.formDesc")}</label>
              <input
                id="formDesc"
                type="text"
                className="appearance-none outline-none border border-[#E3E5E6] rounded-lg w-full p-2 text-gray-11 placeholder:text-gray-10 dark:placeholder:!text-gray-10"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-b-solid border-b-[#E0E0E0] pb-2 mb-4">
            <CustomCheckBox
              onChange={() => setIsFormPined((prev) => !prev)}
              checked={isFormPined}
            />
            <label htmlFor="formDesc">{t("forms.pinForm")}</label>
          </div>

          <div className="flex overflow-y-auto overflow-x-auto gap-8">
            <div className="flex-[0.3]">
              <h5 className="text-start text-[12px] py-2 md:text-[20px] font-medium text-gray-11 w-[100%] flex items-center justify-between border-b border-[#F2F2F2] mb-4">
                {t("clients.blocks")}
                <AddButtonIcon
                  onClick={() => addBlockFieldModalHandler(true)}
                />
              </h5>
              {fullFormData && !isLoading && fullFormData.length > 0 ? (
                <div className="border border-[#F2F2F2] rounded-lg p-1">
                  <Draggable
                    onPosChange={(currentPos, newPos) =>
                      getChangedFieldsPos(currentPos, newPos, true)
                    }
                  >
                    {fullFormData.map((blockData, index) => (
                      <BlockButton
                        classes="flex items-center justify-between custom-word-break"
                        key={index}
                        onClick={() => activeBlockHandler(blockData.block_id)}
                        // active={activeBlock === blockData.block_id}
                      >
                        {lang === "he"
                          ? blockData?.field_name_language.he
                          : blockData.block}
                        <div className="flex items-center">
                          {blockData?.is_editable && (
                            <EditButtonIcon
                              extra="mr-2"
                              onClick={() =>
                                editBlockFieldModalHandler(blockData, true)
                              }
                            />
                          )}
                          {blockData?.is_delete && (
                            <img
                              src={BinIcon}
                              alt="BinIcon"
                              className="mr-2 hover:cursor-pointer"
                              onClick={() => {
                                setDeleteMethod((prev) => ({
                                  type: blockData.block_id,
                                  value: true,
                                }));
                                setConfirmationModal(true);
                              }}
                            />
                          )}
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
              {fullFormData && (
                <Accordion
                  defaultIndex={Array.from(
                    { length: fullFormData?.length },
                    (x, i) => i
                  )}
                  allowMultiple
                >
                  {!isLoading &&
                    fullFormData.map((blockData, index) => (
                      <CustomAccordion
                        key={index}
                        showAddButton={true}
                        title={
                          lang === "he"
                            ? blockData.field_name_language.he
                            : blockData.block
                        }
                        onClick={() =>
                          addBlockFieldModalHandler(false, blockData.block_id)
                        }
                      >
                        {blockData.field.length > 0 ? (
                          <div className="flex flex-col gap-4">
                            <Draggable
                              onPosChange={(currentPos, newPos) =>
                                getChangedFieldsPos(
                                  currentPos,
                                  newPos,
                                  false,
                                  blockData.block_id
                                )
                              }
                            >
                              {blockData.field.map((field, index) => {
                                const isCheckBox = checkBoxConstants.includes(
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
                                          {lang === "he"
                                            ? field?.field_name_language.he
                                            : field?.field_name}
                                        </label>
                                        <p className="text-md mx-1 capitalize text-gray-10 font-normal">{`(${field?.data_type?.label})`}</p>
                                      </div>
                                      <div className="flex items-center">
                                        {field?.is_editable && (
                                          <EditButtonIcon
                                            extra="mr-2"
                                            onClick={() =>
                                              editBlockFieldModalHandler(
                                                field,
                                                false
                                              )
                                            }
                                          />
                                        )}
                                        {field?.is_delete && (
                                          <img
                                            src={BinIcon}
                                            alt="BinIcon"
                                            className="mr-2 hover:cursor-pointer"
                                            onClick={() => {
                                              setDeleteMethod((prev) => ({
                                                type: field?.id,
                                                value: false,
                                              }));
                                              setConfirmationModal(true);
                                            }}
                                          />
                                        )}
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
              <BlockFieldModal
                editData={editData}
                block={isAddBlock}
                blockId={activeBlock}
                onClick={() =>
                  fetchFullformDataHandler(setIsLoading, setFullFormData)
                }
                setShowModal={setShowModal}
              />
            )}

            {confirmationModal && (
              <DeleteConfirmationModal
                showModal={confirmationModal}
                setShowModal={setConfirmationModal}
                onClick={() => {
                  deleteBlockFieldHandler(
                    deleteMethod.type,
                    deleteMethod.value
                  );
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Forms;
