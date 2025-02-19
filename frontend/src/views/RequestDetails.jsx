// React Imports
import React, { Fragment, useEffect, useState } from "react";

// UI Imports
import { TablePagination } from "@mui/material";

// UI Component Imports
import NoDataFound from "../component/common/NoDataFound";
import RequestActionModal from "../component/request/RequestActionModal";
import AddButtonIcon from "../component/common/AddButton";
import SearchField from "../component/fields/SearchField";
import Loader from "../component/common/Loader";
import ErrorMessage from "../component/common/ErrorMessage";

// Third part imports
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// API services
import requestService from "../services/request";

// Utils imports
import { formateDateTime } from "../lib/CommonFunctions";

// Icon imports
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const RequestDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(10);
  const [searchData, setSearchData] = useState({});
  const [initialActionData, setInitialActionData] = useState([]);
  const [requestID, setRequestID] = useState(null);
  const [sectorBlockUrls, setSectorBlockUrls] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const {
    data: RequestData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["request", id],
    queryFn: () => requestService.fetchRequestDetails(id),
  });

  const fetchManualActionsHandler = async () => {
    const params = `&page=${page + 1}&page_size=${rowsPerPage}`;
    try {
      const res = await requestService.fetchManualActions(id, params);
      setTotalCount(res.data.count);
      setInitialActionData(res.data.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: manualActions,
    isLoadingManualActions,
    errorManualActions,
    refetch: manualActionsRefetch,
  } = useQuery({
    queryKey: ["manualActions", page, rowsPerPage],
    queryFn: () => fetchManualActionsHandler(),
    keepPreviousData: true,
  });

  const handleSortHandler = (field) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    if (field !== sortField) {
      setSortField(field);
    }
    const sortedData = [...manualActions.data].sort((a, b) => {
      if (newSortOrder === "asc") {
        if (a[field] > b[field]) return 1;
        if (a[field] < b[field]) return -1;
        return 0; // Return 0 if they are equal
      } else {
        if (a[field] < b[field]) return 1;
        if (a[field] > b[field]) return -1;
        return 0; // Return 0 if they are equal
      }
    });

    // Update the query data
    queryClient.setQueryData(["manualActions", page, rowsPerPage], {
      ...manualActions,
      data: sortedData,
    });
  };

  const AttributesValues = ({ attr, value }) => {
    return (
      <div className="flex mt-2">
        <p className="text-lg font-[500] w-1/3">{attr}</p>
        <p className="mx-2">:</p>
        <div className="w-2/3">{value}</div>
      </div>
    );
  };

  const setSearchDataValues = () => {
    if (initialActionData.length === 0) return;
    const filteredData = initialActionData.filter((item) => {
      return Object.keys(searchData).every((key) => {
        // Check if the item has the key and if it includes the search value
        return item[key]
          ?.toString()
          .toLowerCase()
          .includes(searchData[key].toLowerCase());
      });
    });

    // Update the query data with the filtered results
    queryClient.setQueryData(["manualActions", page, rowsPerPage], {
      ...manualActions,
      data: filteredData,
    });
  };

  const searchResult = (field, value) => {
    setSearchData((prev) => {
      const newData = { ...prev };
      if (value === "") {
        // If the value is an empty string, remove the field from searchData
        delete newData[field];
      } else {
        // Otherwise, update the field with the new value
        newData[field] = value;
      }
      return newData;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addRequestActionsData = async (data) => {
    setIsActionLoading(true);
    const updatedData = { ...data, email_request_id: requestID };
    try {
      const res = await requestService.addRequestActions(updatedData);
      manualActionsRefetch();
      toast.success(res.data.message);
      setSectorBlockUrls([]);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const closeRequestActionModal = () => {
    setRequestID(null);
    setSectorBlockUrls([]);
  };

  useEffect(() => {
    const searchTimer = setTimeout(() => setSearchDataValues(), 500);
    return () => clearTimeout(searchTimer);
  }, [JSON.stringify(searchData)]);

  return (
    <div className="h-full w-full overflow-y-auto bg-white rounded-xl p-4">
      {isLoading && <Loader />}
      {error && (
        <div className="h-1/2 w-full flex justify-center items-center">
          <ErrorMessage
            message={t("requestDetails.errorMessageForRequestDetails")}
          />
        </div>
      )}
      {!isLoading && !error && RequestData && (
        <>
          <h1 className="text-2xl font-semibold">
            {t("requestDetails.requestDetails")}
          </h1>
          <div className="mt-4">
            <AttributesValues
              attr={t("requestDetails.requestId")}
              value={RequestData?.data?.data.id}
            />
            <AttributesValues
              attr={t("requestDetails.username")}
              value={RequestData?.data?.data?.username}
            />
            <AttributesValues
              attr={t("requestDetails.status")}
              value={
                RequestData?.data?.data?.status?.label ??
                JSON.stringify(RequestData?.data?.data?.status)
              }
            />
            <AttributesValues
              attr={t("requestDetails.requestType")}
              value={RequestData?.data?.data?.request_type}
            />
            <AttributesValues
              attr={t("requestDetails.requestedWebsite")}
              value={RequestData?.data?.data?.requested_website}
            />
            <AttributesValues
              attr={t("requestDetails.senderEmail")}
              value={RequestData?.data?.data?.sender_email}
            />
            <AttributesValues
              attr={t("requestDetails.emailId")}
              value={RequestData?.data?.data?.email_id}
            />
            <AttributesValues
              attr={t("requestDetails.customerId")}
              value={RequestData?.data?.data?.customer_id}
            />
            <AttributesValues
              attr={t("requestDetails.text")}
              value={RequestData?.data?.data?.text}
            />
            <AttributesValues
              attr={t("requestDetails.ticketId")}
              value={RequestData?.data?.data?.ticket_id}
            />
            <AttributesValues
              attr={t("requestDetails.proceed")}
              value={JSON.stringify(RequestData?.data?.data?.is_proceed)}
            />
            <AttributesValues
              attr={t("requestDetails.actionsDone")}
              value={RequestData?.data?.data?.action_done}
            />
            <AttributesValues
              attr={t("requestDetails.dateCreated")}
              value={
                <span>
                  {formateDateTime(RequestData?.data?.data?.created_at).date}
                  <br />
                  {formateDateTime(RequestData?.data?.data?.created_at).time}
                </span>
              }
            />
            <AttributesValues
              attr={t("requestDetails.netfreeUrlsData")}
              value={
                <>
                  {RequestData?.data?.data?.netfree_urls_data.netfree_url &&
                  RequestData?.data?.data?.netfree_urls_data.sector_block ? (
                    <>
                      <div>
                        <span className="font-semibold">
                          {t("requestDetails.netfreeUrls")}
                        </span>
                        <br />
                        {RequestData?.data?.data?.netfree_urls_data.netfree_url.map(
                          (url, i) => (
                            <Fragment key={i}>
                              <span>{url}</span>
                              <br />
                            </Fragment>
                          )
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">
                          {t("requestDetails.sectorBlock")}
                        </span>
                        <br />
                        {RequestData?.data?.data?.netfree_urls_data.sector_block.map(
                          (url, i) => (
                            <Fragment key={i}>
                              <span>{url}</span>
                              <br />
                            </Fragment>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <span>{t("common.noDataFound")}</span>
                  )}
                </>
              }
            />
            <p className="text-lg font-[500] mt-6 flex items-center">
              {t("requestDetails.manualActions")}
              <AddButtonIcon
                onClick={() => {
                  setShowActionModal(true);
                  setRequestID(id);
                  if (
                    RequestData?.data?.data?.netfree_urls_data?.sector_block &&
                    RequestData?.data?.data?.netfree_urls_data?.sector_block
                      .length > 0
                  ) {
                    setSectorBlockUrls(
                      RequestData?.data?.data?.netfree_urls_data?.sector_block
                    );
                  }
                }}
              />
            </p>
            <div className="min-h-[50vh] overflow-y-auto overflow-x-auto mt-6 flex justify-between flex-col">
              <table className="!table  text-[12px] md:text-[14px] mb-3 xl:w-full">
                <thead className="sticky top-0 z-10 [&_th]:min-w-[8.5rem] bg-[#F9FBFC]">
                  <tr className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></tr>
                  <tr className="tracking-[-2%] mb-5">
                    <th className="pr-3 pl-3 pb-2">
                      <SearchField
                        variant="auth"
                        extra="mb-2"
                        label={
                          <span
                            onClick={() => handleSortHandler("url")}
                            className={`flex cursor-pointer items-center justify-between w-full ${
                              lang === "he" ? "text-[16.5px]" : "text-[15px]"
                            }`}
                          >
                            {t("requestDetails.url")}
                            {sortField === "url" ? (
                              sortOrder === "asc" ? (
                                <FaArrowUp className="ml-1" />
                              ) : (
                                <FaArrowDown className="ml-1" />
                              )
                            ) : (
                              <FaArrowUp className="ml-1" />
                            )}
                          </span>
                        }
                        id="url"
                        type="text"
                        placeholder={t("searchbox.placeHolder")}
                        onChange={(e) => searchResult("url", e.target.value)}
                        name="url"
                      />
                    </th>
                    <th className="pr-3 pb-2">
                      <SearchField
                        variant="auth"
                        extra="mb-2"
                        label={
                          <span
                            onClick={() =>
                              handleSortHandler("action_display_text")
                            }
                            className={`flex cursor-pointer items-center justify-between w-full ${
                              lang === "he" ? "text-[16.5px]" : "text-[15px]"
                            }`}
                          >
                            {t("requestDetails.actionLabel")}
                            {sortField === "action_display_text" ? (
                              sortOrder === "asc" ? (
                                <FaArrowUp className="ml-1" />
                              ) : (
                                <FaArrowDown className="ml-1" />
                              )
                            ) : (
                              <FaArrowUp className="ml-1" />
                            )}
                          </span>
                        }
                        id="action_display_text"
                        type="text"
                        placeholder={t("searchbox.placeHolder")}
                        onChange={(e) =>
                          searchResult("action_display_text", e.target.value)
                        }
                        name="action_display_text"
                      />
                    </th>
                    <th className="pr-3 pb-2">
                      <SearchField
                        variant="auth"
                        extra="mb-2"
                        label={
                          <span
                            onClick={() =>
                              handleSortHandler("created_by_email")
                            }
                            className={`flex cursor-pointer items-center justify-between w-full ${
                              lang === "he" ? "text-[16.5px]" : "text-[15px]"
                            }`}
                          >
                            {t("requestDetails.createdByEmail")}
                            {sortField === "created_by_email" ? (
                              sortOrder === "asc" ? (
                                <FaArrowUp className="ml-1" />
                              ) : (
                                <FaArrowDown className="ml-1" />
                              )
                            ) : (
                              <FaArrowUp className="ml-1" />
                            )}
                          </span>
                        }
                        id="created_by_email"
                        type="text"
                        placeholder={t("searchbox.placeHolder")}
                        onChange={(e) =>
                          searchResult("created_by_email", e.target.value)
                        }
                        name="created_by_email"
                      />
                    </th>
                    <th className="pr-3 pb-2">
                      <SearchField
                        variant="auth"
                        extra="mb-2"
                        label={
                          <span
                            onClick={() => handleSortHandler("created_at")}
                            className={`flex cursor-pointer items-center justify-between w-full ${
                              lang === "he" ? "text-[16.5px]" : "text-[15px]"
                            }`}
                          >
                            {t("requestDetails.dateCreated")}
                            {sortField === "created_at" ? (
                              sortOrder === "asc" ? (
                                <FaArrowUp className="ml-1" />
                              ) : (
                                <FaArrowDown className="ml-1" />
                              )
                            ) : (
                              <FaArrowUp className="ml-1" />
                            )}
                          </span>
                        }
                        id="created_at"
                        type="text"
                        placeholder={t("searchbox.placeHolder")}
                        onChange={(e) =>
                          searchResult("created_at", e.target.value)
                        }
                        name="created_at"
                      />
                    </th>
                    <th className="pr-3 pb-2">
                      <SearchField
                        variant="auth"
                        extra="mb-2"
                        label={
                          <span
                            onClick={() => handleSortHandler("custom_emails")}
                            className={`flex cursor-pointer items-center justify-between w-full ${
                              lang === "he" ? "text-[16.5px]" : "text-[15px]"
                            }`}
                          >
                            {t("requestDetails.customEmails")}
                            {sortField === "custom_emails" ? (
                              sortOrder === "asc" ? (
                                <FaArrowUp className="ml-1" />
                              ) : (
                                <FaArrowDown className="ml-1" />
                              )
                            ) : (
                              <FaArrowUp className="ml-1" />
                            )}
                          </span>
                        }
                        id="custom_emails"
                        type="text"
                        placeholder={t("searchbox.placeHolder")}
                        onChange={(e) =>
                          searchResult("custom_emails", e.target.value)
                        }
                        name="custom_emails"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_td]:min-w-[12rem] [&_td]:max-w-[20rem]">
                  {isLoading || isLoadingManualActions ? (
                    <tr>
                      <td colSpan="6">
                        <div className="h-[calc(100vh-210px)] w-full flex justify-center items-center">
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {!isLoadingManualActions &&
                      !errorManualActions &&
                      manualActions?.data?.length > 0 ? (
                        <>
                          {manualActions?.data?.map((el, i) => {
                            return (
                              <tr
                                className="h-[75px] border-b border-b-[#F2F2F2]"
                                key={i}
                              >
                                <td className="py-12 pr-2 text-clip break-all">
                                  {el.url}
                                </td>
                                <td>{el.action_display_text}</td>
                                <td>{el.created_by_email}</td>
                                <td>
                                  {formateDateTime(el.created_at).date}
                                  <br />
                                  {formateDateTime(el.created_at).time}
                                </td>
                                <td>
                                  {el.custom_emails.map((email, index) => {
                                    return (
                                      <p className="mt-1/2" key={index}>
                                        {email}
                                      </p>
                                    );
                                  })}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      ) : (
                        <tr className="h-[75px] text-center">
                          <td colSpan={6}>
                            <NoDataFound
                              description={t("common.noDataFound")}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                rowsPerPageOptions={[5, 10]}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
          <RequestActionModal
            showModal={showActionModal}
            setShowModal={setShowActionModal}
            onClose={closeRequestActionModal}
            onSubmit={addRequestActionsData}
            isLoading={isActionLoading}
            sectorBlockUrls={sectorBlockUrls}
          />
        </>
      )}
    </div>
  );
};

export default RequestDetails;
