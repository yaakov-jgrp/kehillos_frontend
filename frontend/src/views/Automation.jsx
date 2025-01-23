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
import { ACTIVE_FORM, FORM_FIELD_CONDITIONS, USER_DETAILS } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setActiveForm } from "../redux/activeFormSlice";
import { setAllFormsState } from "../redux/allFormsSlice";
import { toast } from "react-toastify";
import { convertDataForShowingForms, formatDate } from "../utils/helpers";
import ToggleSwitch from "../component/common/ToggleSwitch";
import automationService from "../services/automation";

function Automation() {
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
  //   const allForms = useSelector((state) => state.allFormsState.allForms);
  const [allFormsLocalState, setAllFormsLocalState] = useState([]);
  const [activeFormId, setActiveFormId] = useState(null);
  const [status, setStatus] = useState(false);
  //   const [automationFormData, setAutomationFormData] = useState([]);
  const permissionsObjects =
    JSON.parse(localStorage.getItem("permissionsObjects")) || {};
  const automationPermission = permissionsObjects?.automationPermission;
  const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const organizationAdmin = userDetails?.organization_admin;
  const writePermission = organizationAdmin
    ? false
    : automationPermission
    ? !automationPermission?.is_write
    : false;
  const updatePermission = organizationAdmin
    ? false
    : automationPermission
    ? !automationPermission?.is_update
    : false;
  const deletePermission = organizationAdmin
    ? false
    : automationPermission
    ? !automationPermission?.is_delete
    : false;

  // handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateStatus = async (e, el) => {
    const data = {
      status: el?.status === "active" ? "inactive" : "active",
    };
    const response = await automationService.updateStatus(el?.id, data);

    if (response?.status === 200 || response?.status === 201) {
      fetchWorkflowData();
    }
    // setStatus(response.data.data.is_active);
  };

  const fetchWorkflowData = async () => {
    setIsLoading(true);
    try {
      let payload = [];
      let searchValues = "";
      const params = `?page=${page + 1}&page_size=${rowsPerPage}&lang=${lang}`;
      const allFormsPayload = await automationService.getAutomationList(params);
      console.log("allFormsPayload", allFormsPayload);

      setAllFormsLocalState(allFormsPayload?.data?.data);
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
      await automationService.deleteWorkflowData(activeFormId);
      await fetchWorkflowData();
    } catch (e) {
      toast.error(JSON.stringify(e));
      console.log(e);
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
    const searchTimer = setTimeout(() => fetchWorkflowData(), 500);
    return () => clearTimeout(searchTimer);
  }, [lang, page, rowsPerPage]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-custom">
      <div className="flex justify-between items-center py-4 px-7 text-gray-11 font-medium text-2xl">
        {t("automation.automation")}
        <Link to={writePermission ? "" : "/settings/automation/new-workflow"}>
          <button
            disabled={writePermission}
            className={`${
              lang === "he" ? "w-[150px]" : "w-[170px]"
            } disabled:cursor-not-allowed h-[40px] rounded-lg py-1 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
            onClick={() => {
              localStorage.setItem("activeForm", JSON.stringify(ACTIVE_FORM));
              dispatch(setActiveForm(ACTIVE_FORM));
            }}
          >
            <img src={AddIcon} alt="add_icon" />
            {t("automation.newWorkflow")}
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
                  label={t("automation.status")}
                  id="status"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("status", e.target.value)}
                  name="status"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("automation.workflowName")}
                  id="workflowName"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("workflowName", e.target.value)}
                  name="workflowName"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("automation.workflowDescription")}
                  id="workflow_description"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) =>
                    searchResult("workflow_description", e.target.value)
                  }
                  name="workflow_description"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("automation.triggerType")}
                  id="trigger_type"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("trigger_type", e.target.value)}
                  name="trigger_type"
                />
              </th>

              <th className="pr-3 pb-2 pt-1">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={t("automation.conditions")}
                  id="conditions"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("conditions", e.target.value)}
                  name="conditions"
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
                {allFormsLocalState && allFormsLocalState.length > 0 ? (
                  <>
                    {allFormsLocalState.map((el) => {
                      return (
                        <tr
                          className="h-[75px] border-b border-b-[#F2F2F2] py-12"
                          key={el.id}
                        >
                          <td>
                            <ToggleSwitch
                              disabled={updatePermission}
                              clickHandler={(e) => handleUpdateStatus(e, el)}
                              selected={
                                el?.status === "inactive" ? false : true
                              }
                            />
                          </td>
                          <td>{el.workflow_name}</td>
                          <td>{el.workflow_description}</td>
                          <td>{el.trigger_type}</td>
                          <td>
                            {el.conditions?.map(
                              (i) => i?.condition + "," + " "
                            )}
                          </td>
                          <td>
                            {el.actions?.map((i) => i?.action_type + "," + " ")}
                          </td>
                          <td>
                            <div className="h-auto w-full flex items-center justify-center gap-2">
                              <Link to={updatePermission ? '' : `/settings/automation/${el.id}`}>
                                <img
                                  src={PencilIcon}
                                  alt="PencilIcon"
                                  className={updatePermission ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}
                                  onClick={updatePermission ? ()=>{} : () => {
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
                                className={deletePermission ? "hover:cursor-not-allowed" : "hover:cursor-pointer"}
                                onClick={deletePermission ? ()=>{} : () => {
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

export default Automation;
