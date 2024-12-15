// React and React Router Imports imports
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
import PencilIcon from "../assets/images/pencil.svg";
import PinIcon from "../assets/pin.svg";
// Utils imports
import { paginationRowOptions } from "../lib/FieldConstants";

// UI Components Imports

// API services

// Utils imports
import { ACTIVE_FORM, FORM_FIELD_CONDITIONS } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setActiveForm } from "../redux/activeFormSlice";
import { setAllFormsState } from "../redux/allFormsSlice";
import { toast } from "react-toastify";
import { convertDataForShowingForms, formatDate } from "../utils/helpers";

function Forms() {
  // states
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [searchParams, setSearchParams] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);
  const dispatch = useDispatch();
  const allForms = useSelector((state) => state.allFormsState.allForms);
  const [allFormsLocalState, setAllFormsLocalState] = useState([]);
  const [activeFormId, setActiveFormId] = useState(null);

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
      }&page_size=${rowsPerPage}${searchValues}`;
      const allFormsPayload = await formsService.getAllForms(params);
      if (
        allFormsPayload?.data?.results &&
        allFormsPayload.data.results.length > 0
      ) {
        payload = allFormsPayload.data.results.map((form) => ({
          ...form,
          createdAt: formatDate(form.createdAt),
          lastEditedAt: formatDate(form.lastEditedAt),
        }));
      }
      dispatch(setAllFormsState(payload));
      setAllFormsLocalState(payload);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      toast.error(JSON.stringify(error));
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteFormData = async () => {
    try {
      await formsService.deleteForm(activeFormId);
      await fetchFormsData();
    } catch (e) {
      toast.error(JSON.stringify(error));
      console.log(error);
    }
    setConfirmationModal(false);
  };

  const searchResult = (searchBy, value) => {
    setSearchParams((prev) => ({ ...prev, ...{ [searchBy]: value } }));
  };

  // effects
  useEffect(() => {
    setIsLoading(true);
    console.log(searchParams);
    let isObjectEmpty = false;
    for (let key in searchParams) {
      isObjectEmpty = !searchParams[key];
    }
    if (!isObjectEmpty && Object.keys(searchParams).length > 0) {
      const filteredAllForms = allFormsLocalState.filter((form) => {
        let condition = true;
        for (let key in searchParams) {
          condition = String(form[key]).includes(searchParams[key]);
        }
        return condition;
      });
      dispatch(setAllFormsState(filteredAllForms));
    } else {
      dispatch(setAllFormsState(allFormsLocalState));
    }
    setIsLoading(false);
  }, [searchParams]);

  useEffect(() => {
    const searchTimer = setTimeout(() => fetchFormsData(), 500);
    return () => clearTimeout(searchTimer);
  }, [lang, page, rowsPerPage]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-custom">
      <div className="flex justify-between items-center py-4 px-7 text-gray-11 font-medium text-2xl">
        {t("forms.formsManagement")}
        <Link to="/settings/forms/new-form">
          <button
            className={`${
              lang === "he" ? "w-[150px]" : "w-[170px]"
            } h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
            onClick={() => {
              localStorage.setItem("activeForm", JSON.stringify(ACTIVE_FORM));
              dispatch(setActiveForm(ACTIVE_FORM));
            }}
          >
            <img src={AddIcon} alt="add_icon" />
            {t("forms.createNewForm")}
          </button>
        </Link>
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
                  onChange={(e) => searchResult("description", e.target.value)}
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
                  onChange={(e) => searchResult("dateCreated", e.target.value)}
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
                          <td><p className="wrap pr-4">{el.name}</p></td>
                          <td><p className="wrap pr-4">{el.description}</p></td>
                          <td>{el.createdAt}</td>
                          <td>{el.lastEditedAt}</td>
                          <td>
                            <div className="h-auto w-full flex items-center justify-center gap-2">
                              <Link to={`/settings/forms/${el.id}`}>
                                <img
                                  src={PencilIcon}
                                  alt="PencilIcon"
                                  className="hover:cursor-pointer"
                                  onClick={() => {
                                    const payload =
                                      convertDataForShowingForms(el);
                                    localStorage.setItem(
                                      "activeForm",
                                      JSON.stringify(payload)
                                    );
                                    dispatch(setActiveForm(payload));
                                  }}
                                />
                              </Link>
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

      {confirmationModal && (
        <DeleteConfirmationModal
          showModal={confirmationModal}
          setShowModal={setConfirmationModal}
          onClick={deleteFormData}
        />
      )}
    </div>
  );
}

export default Forms;
