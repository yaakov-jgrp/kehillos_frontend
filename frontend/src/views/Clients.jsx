// React imports
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// UI Imports
import { TablePagination } from "@mui/material";

// UI Components Imports
import Loader from "../component/common/Loader";
import AddButtonIcon from "../component/common/AddButton";
import ClientModal from "../component/client/ClientModal";
import CsvImporter from "../component/client/CsvImporter";
import DisplayFieldsModal from "../component/client/DisplayFieldsModal";
import SearchField from "../component/fields/SearchField";
import FilterModal from "../component/client/FilterModal";
import NoDataFound from "../component/common/NoDataFound";
import CustomField from "../component/fields/CustomField";
import IconButton from "@mui/material/IconButton";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Third part Imports
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// API services
import clientsService from "../services/clients";
import categoryService from "../services/category";

// Icon imports
import VisibilityIcon from "../assets/images/visibility_icon.svg";
import AddIcon from "../assets/images/add.svg";
import ArrowUp from "../assets/images/arrow_upward.svg";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Utils imports
import { handleSort } from "../lib/CommonFunctions";
import {
  NumberFieldConstants,
  dateRegex,
  linkTypes,
  paginationRowOptions,
} from "../lib/FieldConstants";
import { USER_DETAILS } from "../constants";
import { UserContext } from "../Hooks/permissionContext";

const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  dayjs.extend(utc);
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const tableRef = useRef(null);
  const { userDetails, permissions } = useContext(UserContext);
  // const permissionsObjects = JSON.parse(localStorage.getItem('permissionsObjects')) || {};
  const clientsPermission = permissions?.clientsPermission;
  // const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const organizationAdmin = userDetails?.organization_admin;
  const [isLoading, setIsLoading] = useState(true);
  const [allClients, setAllClients] = useState([]);
  const [clientModal, setClientModal] = useState(false);
  const [newClient, setNewClient] = useState(true);
  const [editClient, setEditClient] = useState({});
  const [netfreeprofiles, setNetfreeProfiles] = useState(null);
  const [fullFormData, setFullFormData] = useState(null);
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [clientRefresh, setClientRefresh] = useState(false);
  const [displayFields, setDisplayFields] = useState([]);
  const [displayFormValues, setDisplayFormValues] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(100);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const writePermission = organizationAdmin
    ? false
    : clientsPermission
    ? !clientsPermission?.is_write
    : false;

  const handleSortHandler = (field, type) => {
    handleSort(
      field,
      allClients,
      sortField,
      sortOrder,
      setSortOrder,
      setSortField,
      setAllClients,
      type
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchFiltersHandler = async () => {
    try {
      const response = await clientsService.getClientFilters();
      setFilters(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClientsData = async () => {
    setIsLoading(true);
    try {
      const filters = await fetchFiltersHandler();
      const defaultFilter = filters?.filter((filter) => filter.fg_default);
      setAppliedFilter(defaultFilter.length > 0 ? defaultFilter[0] : null);
      const filterParams =
        defaultFilter.length > 0 ? `&filter_ids=${defaultFilter[0].id}` : "";
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
      }&lang=${lang}&page_size=${rowsPerPage}${searchValues}${filterParams}`;
      const clientsData = await clientsService.getClients(params);
      setTotalCount(clientsData.data.count);
      setAllClients(clientsData?.data?.data);
      if (clientsData?.data?.data.length > 0) {
        setEditClient(clientsData?.data?.data[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchFullFormData = async () => {
    try {
      const formData = await clientsService.getFullformClientsPageData();
      let formFields = [];
      formData.data.result.forEach((block) => {
        block.field.forEach((field) => {
          formFields.push(field);
        });
      });

      // Array of objects
      const arr = formFields.map((item) => {
        return {
          [item.field_slug]: item.display,
        };
      });

      // Combine all objects into a single object
      const result = arr.reduce((acc, curr) => Object.assign(acc, curr), {});
      const searchFields = arr.reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
          acc[key] = "";
        });
        return acc;
      }, {});
      setSearchParams(searchFields);
      setDisplayFormValues(result);
      setDisplayFields(formFields);
      setFullFormData(formFields);
    } catch (error) {
      console.log(error);
    }
  };

  const searchResult = (searchBy, value) => {
    setSearchParams((prev) => ({ ...prev, ...{ [searchBy]: value } }));
  };

  const fetchNetfreeProfiles = async () => {
    const profilesListData =
      await categoryService.getProfilesListClientsPages();
    setNetfreeProfiles(profilesListData.data.data);
  };

  const exportClientsHandler = async () => {
    const param = `?filter_ids=${appliedFilter?.id}`;
    const res = await clientsService.exportClients(
      appliedFilter?.id ? param : ""
    );
    var url = "data:text/csv;charset=utf-8,%EF%BB%BF" + res.data;
    var a = document.createElement("a");
    a.href = url;
    a.download = "Clients.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleRowClick = (id) => {
    navigate(`/clients/${id}`);
  };

  const applyFilterHandler = async (filter, value) => {
    const filterData = filter;
    filterData["fg_default"] = value;
    const updateData = {
      filter_group_id: filter?.id,
      default: value,
      ...filterData,
    };
    const res = await clientsService.updateFilterGroup(updateData);
    fetchClientsData();
  };

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      fetchClientsData();
      fetchNetfreeProfiles();
    }, 500);
    return () => clearTimeout(searchTimer);
  }, [page, rowsPerPage, lang, JSON.stringify(searchParams), clientRefresh]);

  useEffect(() => {
    fetchFullFormData();
  }, []);

  const formatWhatsAppTime = (checkedAt) => {
    if (!checkedAt) return "";
    const now = dayjs();
    const checkTime = dayjs(checkedAt);
    const diffMinutes = now.diff(checkTime, "minute");
    const diffHours = now.diff(checkTime, "hour");
    const diffDays = now.diff(checkTime, "day");

    if (diffDays > 30) {
      return "1 month ago";
    } else if (diffDays >= 7) {
      return checkTime.format("DD/MM/YYYY");
    } else if (diffDays >= 1) {
      return `${diffDays}d ago`;
    } else if (diffHours >= 1) {
      return `${diffHours}h ago`;
    } else if (diffMinutes >= 10) {
      return `${diffMinutes}m ago`;
    }
    return "now";
  };

  return (
    <div className="w-full bg-white rounded-3xl mt-1 shadow-custom">
      {allClients && netfreeprofiles && editClient && clientModal && (
        <ClientModal
          organizationAdmin={organizationAdmin}
          clientsPermission={clientsPermission}
          showModal={clientModal}
          setShowModal={setClientModal}
          setClientRefresh={setClientRefresh}
          clientRefresh={clientRefresh}
          newClient={newClient}
          client={editClient}
          netfreeProfiles={netfreeprofiles}
          fullFormData={fullFormData}
          onClick={() => {
            <label
              className={`w-fit rounded-lg flex items-center justify-center py-1 px-3 text-[14px] font-medium dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 border border-[#E3E5E6]`}
              onClick={() => setShowDisplayModal(!showDisplayModal)}
            >
              {/* <FiSettings
              className={`rounded-full text-white  ${
                lang === "he" ? "ml-1" : "mr-1"
              } w-3 h-3 hover:cursor-pointer`}
            /> */}
              {/* <img src="" alt="" /> */}
              {t("clients.visibility")}
            </label>;
          }}
        />
      )}

      <div className="flex justify-between py-4 px-7">
        <p className="text-gray-11 font-medium text-2xl">
          {t("clients.title")}
          {appliedFilter && (
            <span className="text-gray-700 text-sm font-normal mx-2">{`( ${t(
              "clients.appliedFilter"
            )} : ${appliedFilter?.name} )`}</span>
          )}
        </p>
        <div className="flex gap-4">
          {fullFormData && (
            <FilterModal
              disabled={writePermission}
              fetchFiltersHandler={fetchFiltersHandler}
              fetchFullFormData={fetchFullFormData}
              fetchClientsData={fetchClientsData}
              applyFilterHandler={applyFilterHandler}
              fullFormData={fullFormData}
              filters={filters}
              showModal={showFilterModal}
              setShowModal={setShowFilterModal}
            />
          )}
          <button
            className={`w-[116px] disabled:cursor-not-allowed rounded-lg py-1 text-[14px] font-semibold dark:bg-brand-400 text-gray-11 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex gap-2 justify-center items-center border border-[#E3E5E6]`}
            onClick={() => setShowDisplayModal(!showDisplayModal)}
          >
            <img src={VisibilityIcon} alt="visibility_icon" />
            {t("clients.visibility")}
          </button>
          <CsvImporter
            disabled={writePermission}
            formFields={fullFormData}
            fetchClientsData={fetchClientsData}
          />
          <button
            disabled={writePermission}
            className={`w-[75px] disabled:cursor-not-allowed rounded-lg py-1 text-[14px] font-medium text-gray-11 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6]`}
            onClick={exportClientsHandler}
          >
            {t("clients.export")}
          </button>
          <button
            disabled={writePermission}
            className={`w-[172px] disabled:cursor-not-allowed rounded-lg py-2 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
            onClick={() => {
              setNewClient(true);
              setClientModal(true);
            }}
          >
            <img src={AddIcon} alt="add_icon" />
            {t("common.AddNewClient")}
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-210px)] overflow-y-auto overflow-x-auto mx-5 px-2 mt-4 custom-scroll-container">
        <table
          className="!table text-[12px] md:text-[14px] min-w-[100%] mb-3"
          ref={tableRef}
        >
          {fullFormData && fullFormData.length > 0 && (
            <thead className="sticky top-0 z-10 [&_th]:min-w-[13rem] bg-[#F9FBFC]">
              <tr className="tracking-[-2%] mb-5 relative">
                <th colSpan={fullFormData.length + 1} className="p-0 h-0">
                  <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute"></div>
                </th>
              </tr>
              <tr className="tracking-[-2%] mb-5">
                <th className="pr-3">
                  <SearchField
                    variant="auth"
                    extra="mb-4 ml-4"
                    label={
                      <p
                        onClick={() => handleSortHandler("id")}
                        className={`flex cursor-pointer items-center justify-between w-full ${
                          lang === "he" ? "text-[16.5px]" : "text-[15px]"
                        }`}
                      >
                        {t("clients.id")}
                        {sortField === "id" ? (
                          sortOrder === "asc" ? (
                            <img
                              src={ArrowUp}
                              alt="arrow-up"
                              className="ml-1"
                            />
                          ) : (
                            <img
                              src={ArrowUp}
                              alt="arrow-up"
                              className="rotate-180 ml-1"
                            />
                          )
                        ) : (
                          <img
                            src={ArrowUp}
                            alt="arrow-up"
                            className="rotate-180 ml-1"
                          />
                        )}
                      </p>
                    }
                    id="field_id"
                    type="text"
                    placeholder={t("searchbox.placeHolder")}
                    onChange={(e) => searchResult("id", e.target.value)}
                    name="id"
                  />
                </th>
                {fullFormData.map((field, i) => {
                  return (
                    <Fragment key={i}>
                      {field?.display && (
                        <th className="pr-3">
                          <SearchField
                            variant="auth"
                            extra="mb-4 ml-4"
                            label={
                              <p
                                onClick={() =>
                                  handleSortHandler(
                                    field?.field_slug,
                                    field?.data_type?.value
                                  )
                                }
                                className={`flex cursor-pointer items-center justify-between w-full ${
                                  lang === "he"
                                    ? "text-[16.5px]"
                                    : "text-[15px]"
                                }`}
                              >
                                {lang === "he"
                                  ? field?.field_name_language.he
                                  : field?.field_name}
                                {sortField === field?.field_slug ? (
                                  sortOrder === "asc" ? (
                                    <img
                                      src={ArrowUp}
                                      alt="arrow-up"
                                      className="ml-1"
                                    />
                                  ) : (
                                    <img
                                      src={ArrowUp}
                                      alt="arrow-up"
                                      className="rotate-180 ml-1"
                                    />
                                  )
                                ) : (
                                  <img
                                    src={ArrowUp}
                                    alt="arrow-up"
                                    className="rotate-180 ml-1"
                                  />
                                )}
                              </p>
                            }
                            id={field?.id}
                            type="text"
                            placeholder={t("searchbox.placeHolder")}
                            onChange={(e) =>
                              searchResult(field?.field_slug, e.target.value)
                            }
                            name={field?.field_slug}
                          />
                        </th>
                      )}
                    </Fragment>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody className="[&_td]:min-w-[9rem]">
            {isLoading ? (
              <tr>
                <td colSpan={fullFormData?.length + 1 || 6}>
                  <div className="h-[calc(100vh-310px)] w-full flex justify-center items-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {allClients?.length > 0 ? (
                  <>
                    {allClients.length > 0 &&
                      allClients.map((client, i) => {
                        return (
                          <tr
                            className="h-[65px] cursor-pointer"
                            key={client.id}
                          >
                            <td
                              className="border-b border-b-[#F2F2F2] p-1"
                              onClick={() => {
                                handleRowClick(client?.id);
                              }}
                            >
                              #{client?.id}
                            </td>
                            {fullFormData?.length > 0 &&
                              fullFormData.map((field, i) => {
                                const dataValue = client[field?.field_slug];
                                const data_type = field?.data_type.value;
                                let value = String(dataValue);
                                switch (data_type) {
                                  case "file":
                                    value =
                                      dataValue?.file_name?.split("upload/")[1];
                                    break;
                                  case "select":
                                    value = dataValue?.value;
                                    break;
                                  case "checkbox":
                                    value =
                                      typeof dataValue === "boolean"
                                        ? JSON.stringify(value)
                                        : value;
                                    break;
                                  default:
                                    // Handle nested JSON objects (like phone fields)
                                    if (
                                      typeof dataValue === "object" &&
                                      dataValue !== null
                                    ) {
                                      if (dataValue.value) {
                                        value = dataValue.value;
                                      } else {
                                        value =
                                          Object.values(dataValue).find(
                                            (v) => v !== null
                                          ) || "";
                                      }
                                    }
                                    break;
                                }
                                let isDate = false;
                                const isNumber =
                                  NumberFieldConstants.includes(data_type);
                                const emptyValues = ["", null];
                                if (dateRegex.test(value)) {
                                  isDate = true;
                                }

                                // Special handling for phone display after basic value is set
                                if (data_type === "phone" && typeof dataValue === "object" && dataValue.whatsapp_status) {
                                  const waStatus = dataValue.whatsapp_status;
                                  if (waStatus !== "unknown") {
                                    const waTime = formatWhatsAppTime(dataValue.whatsapp_checked_at);
                                    value = (
                                      <div className="flex items-center gap-1">
                                        <span>{dataValue.number}</span>
                                        <span className={waStatus === "none" ? "text-red-500" : "text-green-600"}>
                                          WA
                                        </span>
                                        {waStatus !== "none" && waTime && (
                                          <span className="text-sm text-gray-500">({waTime})</span>
                                        )}
                                      </div>
                                    );
                                  }
                                }

                                return (
                                  <Fragment key={i}>
                                    {field?.display && (
                                      <td
                                        className="p-1 border-b border-b-[#F2F2F2]"
                                        key={i}
                                        onClick={() => {
                                          !linkTypes.includes(data_type) &&
                                            handleRowClick(client?.id);
                                        }}
                                      >
                                        {emptyValues.includes(value) && (
                                          <a
                                            href={"#"}
                                            className="text-gray-11 hover:text-gray-10 font-normal"
                                          >
                                            -
                                          </a>
                                        )}
                                        {!emptyValues.includes(value) && (
                                          <>
                                            {isDate ? (
                                              <span>
                                                {dayjs(value).format(
                                                  "DD/MM/YYYY"
                                                )}
                                              </span>
                                            ) : isNumber ? (
                                              <span>{parseFloat(value)}</span>
                                            ) : linkTypes.includes(
                                                data_type
                                              ) ? (
                                              <a
                                                href={
                                                  data_type !== "phone"
                                                    ? `mailto:${
                                                        typeof value === "object"
                                                          ? value.props.children[0].props.children
                                                          : value
                                                      }`
                                                    : "#"
                                                }
                                                className="text-gray-11 hover:text-gray-10 font-normal"
                                              >
                                                {value}
                                              </a>
                                            ) : data_type === "checkbox" ? (
                                              <CustomField
                                                field={field}
                                                value={value}
                                                disabled={true}
                                              />
                                            ) : (
                                              <span>{value}</span>
                                            )}
                                          </>
                                        )}
                                      </td>
                                    )}
                                  </Fragment>
                                );
                              })}
                          </tr>
                        );
                      })}
                  </>
                ) : (
                  <tr className="h-[75px] text-center">
                    <td colSpan={fullFormData?.length + 1 || 6}>
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
        onPageChange={handleChangePage}
        rowsPerPageOptions={paginationRowOptions}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {showDisplayModal && (
        <DisplayFieldsModal
          disabled={
            organizationAdmin
              ? false
              : clientsPermission
              ? !clientsPermission?.is_update
              : false
          }
          formValues={displayFormValues}
          displayFields={displayFields}
          onClick={() => {
            fetchFullFormData();
            fetchClientsData();
          }}
          showModal={showDisplayModal}
          setShowModal={setShowDisplayModal}
        />
      )}
    </div>
  );
};

export default Clients;
