// React imports
import { useContext, useEffect, useState } from "react";

// UI Imports
import { Box, CircularProgress, IconButton, MenuItem, Modal, Select, TablePagination, Tooltip, Typography } from "@mui/material";

import { FaInfo } from "react-icons/fa";

// UI Components Imports
import SearchField from "../component/fields/SearchField";
import Loader from "../component/common/Loader";
import NoDataFound from "../component/common/NoDataFound";
import RequestStatusModal from "../component/request/RequestStatusModal";
import ResponseStatusModal from "../component/request/RequestStatusModal";
// Third part Imports
import { useTranslation } from "react-i18next";

// API services
import requestService from "../services/request";

// Icon imports
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Utils imports
import { paginationRowOptions, searchFields } from "../lib/FieldConstants";
import { formateDateTime, handleSort } from "../lib/CommonFunctions";
import { IoArrowBackCircle, IoClose, IoEyeOutline, IoReloadCircleOutline } from "react-icons/io5";
import { GridDeleteIcon } from "@mui/x-data-grid";
import axios from "axios";
import { USER_DETAILS } from "../constants";
import { update } from "lodash";
import { UserContext } from "../Hooks/permissionContext";

const Request = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [isLoading, setIsLoading] = useState(true);
  const [allRequest, setAllRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [searchParams, setSearchParams] = useState(searchFields);
  const [requestStatuses, setRequestStatuses] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { userDetails, permissions } = useContext(UserContext);
  // const permissionsObjects =
  //     JSON.parse(localStorage.getItem("permissionsObjects")) || {};
    const requestsPermission = permissions?.requestsPermission;
    // const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
    const organizationAdmin = userDetails?.organization_admin;
    const writePermission = organizationAdmin
      ? false
      : requestsPermission
      ? !requestsPermission?.is_write
      : false;
    const updatePermission = organizationAdmin
      ? false
      : requestsPermission
      ? !requestsPermission?.is_update
      : false;
    const deletePermission = organizationAdmin
      ? false
      : requestsPermission
      ? !requestsPermission?.is_delete
      : false;

  const fetchScreenshot = async (url, request_id, refetch) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestService.fetchRequestScreenshot({ url, request_id, refetch });
      setImageSrc(`data:image/png;base64,${response.data.image}`);
    } catch (err) {
      setError('Failed to load screenshot');
    } finally {
      setLoading(false);
    }
  };
  const handleClickOpen = (requested_website, request_id, refetch = false) => {
    setOpen(true);
    fetchScreenshot(requested_website, request_id, refetch);
  };



  const handleClose = () => {
    setOpen(false);
    setImageSrc('');
    setError(null);
  };
  const handleSortHandler = (field) => {
    handleSort(
      field,
      allRequest,
      sortField,
      sortOrder,
      setSortOrder,
      setSortField,
      setAllRequests
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleImageClick = () => {
    const newTab = window.open();
    newTab.document.body.innerHTML = `
    <style>
      * {
        margin: 0;
        padding: 0;
      }
    </style>
    <img src="${imageSrc}" alt="Screenshot" style="width: 100%; height: 100%;" />
    `;
  };

  const fetchRequestStatuses = async () => {
    try {
      const params = `?lang=${lang}`;
      const res = await requestService.getRequestStatuses(params);
      setRequestStatuses(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRequestData = async () => {
    setIsLoading(true);
    try {
      let searchValues = "";
      for (const searchfield in searchParams) {
        if (searchParams[searchfield] !== "") {
          searchValues += `&search_${[searchfield]}=${searchParams[searchfield]
            }`;
        }
      }
      const params = `?page=${page + 1
        }&lang=${lang}&page_size=${rowsPerPage}${searchValues}`;
      const requestData = await requestService.getRequests(params);
      setTotalCount(requestData?.data?.count);
      setAllRequests(requestData?.data?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const searchResult = (searchBy, value) => {
    let values = [];
    if (searchBy === "from") {
      values = { sender_email: value, customer_id: value, username: value };
    } else if (searchBy === "requestdetail") {
      values = { text: value, requested_website: value };
    } else {
      values = { [searchBy]: value };
    }
    setSearchParams((prev) => ({ ...prev, ...values }));
  };

  const changeStatusHandler = async (data) => {
    try {
      const formData = new FormData();
      formData.append("status_id", data.status_id);
      formData.append("email_request_id", data.email_request_id);
      const res = await requestService.updateRequestStatus(formData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequestStatuses();
  }, [lang]);

  useEffect(() => {
    const searchTimer = setTimeout(() => fetchRequestData(), 500);
    return () => clearTimeout(searchTimer);
  }, [lang, page, rowsPerPage, JSON.stringify(searchParams)]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-custom">
      <div className="flex py-4 px-7 justify-between text-gray-11 font-medium text-2xl">
        {t("requests.title")}
        <RequestStatusModal
          writePermission={writePermission}
          updatePermission={updatePermission}
          deletePermission={deletePermission}
          requestStatuses={requestStatuses}
          fetchRequestStatuses={fetchRequestStatuses}
        />
      </div>
      <div className="h-[calc(100vh-210px)] overflow-y-auto overflow-x-auto mx-5 px-2">
        <table className="!table text-[12px] md:text-[14px] mb-3">
          <thead className="sticky top-0 z-10 [&_th]:min-w-[8.5rem] bg-[#F9FBFC]">
            <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
            <tr className="tracking-[-2%] mb-5">
              <th className="pr-3 pl-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={
                    <p
                      onClick={() => handleSortHandler("id")}
                      className={`flex cursor-pointer items-center justify-between w-full ${lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                    >
                      {t("searchbox.requestId")}
                      {sortField === "id" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="ml-1" />
                        ) : (
                          <FaArrowDown className="ml-1" />
                        )
                      ) : (
                        <FaArrowUp className="ml-1" />
                      )}
                    </p>
                  }
                  id="requestId"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("id", e.target.value)}
                  name="id"
                />
              </th>
              <th className="pr-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={
                    <p
                      onClick={() => handleSortHandler("created_at")}
                      className={`flex cursor-pointer items-center justify-between w-full ${lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                    >
                      {t("searchbox.dateCreated")}
                      {sortField === "created_at" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="ml-1" />
                        ) : (
                          <FaArrowDown className="ml-1" />
                        )
                      ) : (
                        <FaArrowUp className="ml-1" />
                      )}
                    </p>
                  }
                  id="dateCreated"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("created_at", e.target.value)}
                  name="created_at"
                />
              </th>
              <th className="pr-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={
                    <p
                      onClick={() => handleSortHandler("sender_email")}
                      className={`flex cursor-pointer items-center justify-between w-full ${lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                    >
                      {t("searchbox.from")}
                      {sortField === "from" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="ml-1" />
                        ) : (
                          <FaArrowDown className="ml-1" />
                        )
                      ) : (
                        <FaArrowUp className="ml-1" />
                      )}
                    </p>
                  }
                  id="from"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("from", e.target.value)}
                  name="from"
                />
              </th>
              <th className="pr-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={
                    <p
                      onClick={() => handleSortHandler("request_type")}
                      className={`flex cursor-pointer items-center justify-between w-full ${lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                    >
                      {t("searchbox.requestType")}
                      {sortField === "request_type" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="ml-1" />
                        ) : (
                          <FaArrowDown className="ml-1" />
                        )
                      ) : (
                        <FaArrowUp className="ml-1" />
                      )}
                    </p>
                  }
                  id="requestType"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("request_type", e.target.value)}
                  name="request_type"
                />
              </th>
              <th className="pr-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={
                    <p
                      onClick={() => handleSortHandler("requested_website")}
                      className={`flex cursor-pointer items-center justify-between w-full ${lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                    >
                      {t("searchbox.requestdetail")}
                      {sortField === "requestdetail" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="ml-1" />
                        ) : (
                          <FaArrowDown className="ml-1" />
                        )
                      ) : (
                        <FaArrowUp className="ml-1" />
                      )}
                    </p>
                  }
                  id="requestdetail"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) =>
                    searchResult("requestdetail", e.target.value)
                  }
                  name="requestdetail"
                />
              </th>
              <th className="pr-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={
                    <p
                      onClick={() => handleSortHandler("status")}
                      className={`flex cursor-pointer items-center justify-between w-full ${lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                    >
                      {t("searchbox.status")}
                      {sortField === "status" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="ml-1" />
                        ) : (
                          <FaArrowDown className="ml-1" />
                        )
                      ) : (
                        <FaArrowUp className="ml-1" />
                      )}
                    </p>
                  }
                  id="status"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("status", e.target.value)}
                  name="status"
                />
              </th>
              <th className="pr-3 pb-2">
                <SearchField
                  variant="auth"
                  extra="mb-2"
                  label={
                    <p
                      onClick={() => handleSortHandler("action_done")}
                      className={`flex cursor-pointer items-center justify-between w-full ${lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                    >
                      {t("searchbox.actionsDone")}
                      {sortField === "action_done" ? (
                        sortOrder === "asc" ? (
                          <FaArrowUp className="ml-1" />
                        ) : (
                          <FaArrowDown className="ml-1" />
                        )
                      ) : (
                        <FaArrowUp className="ml-1" />
                      )}
                    </p>
                  }
                  id="actionsDone"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => searchResult("action_done", e.target.value)}
                  name="action_done"
                />
              </th>
            </tr>
          </thead>
          <tbody className="[&_td]:min-w-[12rem] [&_td]:max-w-[20rem]">
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
                {allRequest.length > 0 ? (
                  <>
                    {allRequest.map((el) => {
                      return (
                        <tr
                          className="h-[75px] border-b border-b-[#F2F2F2]"
                          key={el.id}
                        >
                          <td className="py-12">#{el.id}</td>
                          <td>
                            {formateDateTime(el.created_at).date}
                            <br />
                            {formateDateTime(el.created_at).time}
                          </td>
                          <td>
                            <a
                              href={`https://netfree.link/app/#/sectors/user-filter-settings/${el.customer_id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-11 hover:text-gray-10 font-medium"
                            >
                              <span>
                              <IconButton
                                onClick={() => window.location.href = `/clients/${el.customer_id}`}
                                className="ml-2"
                              >
                                <FaInfo size={15} />
                              </IconButton>
                              </span>
                              #{el.customer_id}
                              <br />
                              
                              
                            </a>
                            {el.username}
                            <br />
                            <a
                              href={`mailto:${el.sender_email}`}
                              className="text-brand-500 hover:text-brand-600 font-medium"
                            >
                              {el.sender_email}
                            </a>
                           
                          </td>
                          <td>{el.request_type}</td>
                          <td className="px-2" >
                            <div className="flex align-center">
                              <div className="flex flex-row mr-1">
                                <IconButton className="disabled:cursor-not-allowed" disabled={writePermission} onClick={() => handleClickOpen(el.requested_website, el.id)}>
                                  <IoEyeOutline size={20} />
                                </IconButton>
                                <IconButton className="disabled:cursor-not-allowed" disabled={writePermission} onClick={() => handleClickOpen(el.requested_website, el.id, true)}>
                                  <IoReloadCircleOutline size={20} />
                                </IconButton>
                              </div>
                              <a
                                href={el.requested_website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-500 hover:text-brand-600 font-medium line-clamp-2 break-words"
                              >
                                {el.requested_website}
                              </a>
                              <Modal
                                open={open}
                                onClose={handleClose}
                                style={{backgroundColor: '#ffffff08', opacity:0.09}}
                                slotProps={{
                                  backdrop: {
                                    sx: {
                                      // backgroundColor: 'transparent', 
                                      // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                      
                                    }
                                  }
                                }}
                                // BackdropProps={{
                                //   style: {
                                //     backgroundColor: 'transparent', // Semi-transparent background
                                //   },
                                // }}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Box
                                  sx={{
                                    position: 'relative',
                                    bgcolor: '#fff',
                                    // p: 4, 
                                    borderRadius: 2,
                                    width: '50vw',
                                    height: '60vh',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    
                                  }}
                                >
                                  {/* Close Button */}
                                  <IconButton
                                    aria-label="close"
                                    onClick={handleClose}
                                    sx={{
                                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                      position: 'absolute',
                                      top: 2,
                                      right: 8,
                                    }}
                                  >
                                    <IoClose />
                                  </IconButton>

                                  {/* Content */}
                                  {loading ? (
                                    <CircularProgress />
                                  ) : error ? (
                                    <Typography color="error">{error}</Typography>
                                  ) : (
                                    <img
                                      src={imageSrc}
                                      
                                      alt="Screenshot"
                                      width="100%"
                                      height="100%"
                                      onClick={handleImageClick}
                                      style={{ borderRadius: 8, cursor: 'pointer'  }}
                                    />
                                  )}
                                </Box>
                              </Modal>

                            </div>
                            <br />
                            <p className="line-clamp-4 break-words">
                              {el.text}
                            </p>
                          </td>
                          <td className="px-2">
                            <Select
                              disabled={updatePermission}
                              MenuProps={{
                                sx: {
                                  maxHeight: "250px",
                                },
                              }}
                              className={`[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-1 text-black ${update ? 'bg-[#ECECEC]' : 'bg-white'}`}
                              onChange={(e) => {
                                const updateData = {
                                  status_id: e.target.value,
                                  email_request_id: el.id,
                                };
                                changeStatusHandler(updateData);
                              }}
                              defaultValue={el?.status?.value || ""}
                              placeholder="Select Profile"
                            >
                              {requestStatuses &&
                                requestStatuses.length > 0 &&
                                requestStatuses?.map((status, id) => {
                                  return status ? (
                                    <MenuItem key={id} value={status?.value}>
                                      {status?.label}
                                    </MenuItem>
                                  ) : null;
                                })}
                            </Select>
                          </td>
                          <td className="flex justify-center gap-4 px-2 my-6">
                            {el.action_done ? (
                              <div className="bg-[#F4F7FE] px-2 py-1 rounded-lg">
                                {el.action_done}
                              </div>
                            ) : (
                              "-"
                            )}
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
    </div>
  );
};

export default Request;
