// React and React Router Imports imports
import React, { useState, useEffect } from "react";

// UI Imports
import { TablePagination } from "@mui/material";

// UI Components Imports
import SearchField from "../component/fields/SearchField";
import Loader from "../component/common/Loader";
import NoDataFound from "../component/common/NoDataFound";
import DeleteConfirmationModal from "../component/common/DeleteConfirmationModal";

// Third part Imports
import { useTranslation } from "react-i18next";
// API services
import formsService from "../services/forms";

// Icon imports
import AddIcon from "../assets/images/add.svg";
import BinIcon from "../assets/images/bin.svg";
import VisibilityIcon from "../assets/images/visibility_icon.svg";
import FilterIcon from "../assets/images/filter_alt.svg";
import PencilIcon from "../assets/images/pencil.svg";
// Utils imports
import { paginationRowOptions } from "../lib/FieldConstants";

// UI Components Imports
import { IoEyeOutline } from "react-icons/io5";

// API services

// Utils imports
import { useDispatch, useSelector } from "react-redux";
import CreateClientFormModal from "../component/forms/CreateClientFormModal";
import FormAddedSuccessfullyModal from "../component/forms/FormAddedSuccessfullyModal";
import {
  convertDataForShowingClientFormDetails,
  formatDate,
} from "../utils/helpers";
import EditClientFormModal from "../component/forms/EditClientFormModal";
import DisplayFieldsModal from "../component/forms/DisplayFieldsModal";
import FilterModal from "../component/forms/FilterModal";

function ClientFormsTable() {
  // states
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [searchParams, setSearchParams] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [allClientForms, setAllClientForms] = useState([]);
  const [activeFormId, setActiveFormId] = useState(null);
  const [showClientFormModal, setShowClientFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clientDetailForm, setClientDetailForm] = useState(null);
  const [showEditClientFormModal, setShowEditClientFormModal] = useState(false);
  const [clientId, setClientId] = useState(0);
  const [clientFormId, setClientFormId] = useState(0);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [displayFields, setDisplayFields] = useState(
    JSON.parse(localStorage.getItem("displayFields")) || {
      name: true,
      clientId: true,
      createdAt: true,
      lastEditedAt: true,
    }
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState(null);

  function applyFilters(filters, clientForms) {
    const applyCondition = (form, filter) => {
      const { attr_name, condition, value } = filter;
      const formValue = form[attr_name].toString();
      switch (condition) {
        case "equals":
          return formValue === value;
        case "not_equals":
          return formValue !== value;
        case "starts_with":
          return formValue.startsWith(value);
        case "not_starts_with":
          return !formValue.startsWith(value);
        case "ends_with":
          return formValue.endsWith(value);
        case "not_ends_with":
          return !formValue.endsWith(value);
        case "contains":
          return formValue.includes(value);
        case "not_contains":
          return !formValue.includes(value);
        case "is_empty":
          return formValue === "";
        case "is_not_empty":
          return formValue !== "";
        default:
          return false;
      }
    };

    const andFilters = filters.filter((f) => f.operator === "AND");
    const orFilters = filters.filter((f) => f.operator === "OR");

    return clientForms.filter((form) => {
      const andPass = andFilters.every((filter) =>
        applyCondition(form, filter)
      );

      const orPass =
        orFilters.length === 0 ||
        orFilters.some((filter) => applyCondition(form, filter));

      return andPass && orPass;
    });
  }

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
      let payload = [];
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
      const allFormsPayload = await formsService.getAllClientsForms(params);
      if (
        allFormsPayload?.data?.results &&
        allFormsPayload.data.results.length > 0
      ) {
        payload = allFormsPayload.data.results.map((clientForm) => ({
          ...clientForm,
          createdAt: formatDate(clientForm.createdAt),
          lastEditedAt: formatDate(clientForm.lastEditedAt),
        }));
        const storedFilters = JSON.parse(
          localStorage.getItem("clientFormsFilters")
        );
        if (storedFilters?.length > 0) {
          storedFilters.forEach((item) => {
            if (item.default) {
              payload = applyFilters(item.filters, payload);
            }
          });
        }
        setTotalCount(allFormsPayload?.data?.count);
      }
      setAllClientForms(payload);
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

  const deleteClientForm = async () => {
    await formsService.deleteClientForm(activeFormId);
    await fetchFormsData();
    setConfirmationModal(false);
  };

  const fetchClientFormsDetailsData = async (formId) => {
    try {
      const formDetailPayload = await formsService.getSingleClientFormDetails(
        formId
      );
      if (formDetailPayload.data) {
        let payload = convertDataForShowingClientFormDetails(
          formDetailPayload.data
        );
        if (payload.versions.length > 0) {
          const sortedVersions = payload.versions.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          const defaultVersion = sortedVersions[0];
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
        }
        console.log(payload);
        setClientDetailForm(payload);
        setClientId(payload.clientId);
        setClientFormId(payload.id);
        setShowEditClientFormModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setAndStoreFilters = (payload) => {
    setFilters(payload);
    localStorage.setItem("clientFormsFilters", JSON.stringify(payload));
  };

  const fetchFiltersHandler = async () => {
    try {
      const storedFilters = JSON.parse(
        localStorage.getItem("clientFormsFilters")
      );
      if (storedFilters?.length > 0) {
        setFilters(storedFilters);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilterHandler = async (filter, value) => {
    filter["default"] = value;
    const payload = filters.map((item) => {
      if (item.id === filter.id) {
        return filter;
      }
      return {
        ...item,
        default: false,
      };
    });
    setAndStoreFilters(payload);
    if (value) {
      setAppliedFilter(filter);
    } else {
      setAppliedFilter(null);
      fetchFormsData();
    }
  };

  // effects
  useEffect(() => {
    const savedFields = JSON.parse(localStorage.getItem("displayFields"));
    if (savedFields) {
      setDisplayFields(savedFields);
    }
  }, []);

  useEffect(() => {
    fetchFormsData();
  }, [lang, page, rowsPerPage, JSON.stringify(searchParams)]);

  useEffect(() => {
    if (appliedFilter && appliedFilter.default) {
      const filteredForms = applyFilters(appliedFilter.filters, allClientForms);
      setAllClientForms(filteredForms);
    }
  }, [appliedFilter]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-custom">
      <div className="flex justify-between items-center py-4 px-7 text-gray-11 font-medium text-2xl">
        {t("forms.forms")}
        <div className="flex items-center gap-2">
          <FilterModal
            fetchFiltersHandler={fetchFiltersHandler}
            fetchFullFormData={fetchFormsData}
            fetchClientsData={fetchFormsData}
            applyFilterHandler={applyFilterHandler}
            fullFormData={allClientForms}
            filters={filters}
            setFilters={setFilters}
            // showModal={showFilterModal}
            // setShowModal={setShowFilterModal}
            setAppliedFilter={setAppliedFilter}
          />
          <button
            className={`w-[116px] rounded-lg py-1 text-[14px] font-semibold dark:bg-brand-400 text-gray-11 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex gap-2 justify-center items-center border border-[#E3E5E6]`}
            onClick={() => setShowVisibilityModal((prev) => !prev)}
          >
            <img src={VisibilityIcon} alt="visibility_icon" />
            {t("clients.visibility")}
          </button>
          <button
            className={`${
              lang === "he" ? "w-[150px]" : "w-[170px]"
            } h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
            onClick={() => {
              setShowClientFormModal(true);
              return null;
            }}
          >
            <img src={AddIcon} alt="add_icon" />
            {t("forms.addNewForm")} 
          </button>
        </div>
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

              {displayFields.name && (
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
              )}

              {displayFields.clientId && (
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
              )}

              {displayFields.createdAt && (
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
              )}

              {displayFields.lastEditedAt && (
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
              )}

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
                {allClientForms && allClientForms.length > 0 ? (
                  <>
                    {allClientForms.map((el) => {
                      return (
                        <tr
                          className="h-[75px] border-b border-b-[#F2F2F2] py-12"
                          key={el.id}
                        >
                          <td>#{el.id}</td>
                          {displayFields.name && <td><p className="wrap pr-4">{el.name}</p></td>}
                          {displayFields.clientId && <td>#{el.clientId}</td>}
                          {displayFields.createdAt && <td>{el.createdAt}</td>}
                          {displayFields.lastEditedAt && (
                            <td>{el.lastEditedAt}</td>
                          )}
                          <td>
                            <div className="h-auto w-full flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  fetchClientFormsDetailsData(el.id);
                                }}
                              >
                                <IoEyeOutline size={20} />
                              </button>
                              <img
                                src={BinIcon}
                                alt="BinIcon"
                                className="hover:cursor-pointer"
                                onClick={() => {
                                  setActiveFormId(el.id);
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

      {showVisibilityModal && (
        <DisplayFieldsModal
          showModal={showVisibilityModal}
          setShowModal={setShowVisibilityModal}
          onClick={(updatedFields) => setDisplayFields(updatedFields)}
        />
      )}

      {showClientFormModal && (
        <CreateClientFormModal
          setShowModal={setShowClientFormModal}
          setShowSuccessModal={setShowSuccessModal}
          clientId={null}
        />
      )}

      {showEditClientFormModal && (
        <EditClientFormModal
          setShowModal={setShowEditClientFormModal}
          setShowSuccessModal={setShowSuccessModal}
          clientId={clientId}
          formId={clientFormId}
          clientDetailForm={clientDetailForm}
        />
      )}

      {confirmationModal && (
        <DeleteConfirmationModal
          showModal={confirmationModal}
          setShowModal={setConfirmationModal}
          onClick={deleteClientForm}
        />
      )}

      {showSuccessModal && (
        <FormAddedSuccessfullyModal
          onClick={() => {
            setShowSuccessModal(false);
          }}
        />
      )}
    </div>
  );
}

export default ClientFormsTable;
