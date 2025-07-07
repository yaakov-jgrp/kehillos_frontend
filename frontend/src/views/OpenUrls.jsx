import React, { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// UI Components Imports
import SearchField from "../component/fields/SearchField";
import Loader from "../component/common/Loader";

// Icon imports
import clientsService from "../services/clients";

// Third party Imports
import { debounce } from "lodash";

const OpenUrls = () => {
  const { t } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    data: openUrlsData = [],
    isFetching: isFetchingOpenUrls,
    error: openUrlsError,
  } = useQuery({
    queryKey: ["openUrlsList", searchValue],
    queryFn: () => {
      if (!searchValue) return Promise.resolve([]);
      return clientsService.fetchClientOpenUrls(searchValue);
    },
    enabled: !!searchValue,
    placeholderData: keepPreviousData,
    onError: (err) => {
      console.error("Open URLs search failed:", err);
    },
  });

  // Debounce just the state update
  const onSearchChange = useCallback(
    debounce((value) => {
      setSearchValue(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  const exportOpenUrlsHandler = () => {
    if (!openUrlsData?.data || openUrlsData.data.length === 0) {
      toast.warning(t("messages.noDataToExport"));
      return;
    }

    // Define CSV headers
    const headers = ["ID", "First Name", "Last Name", "Email", "URLs"];

    // Convert data to CSV format
    const csvContent = [
      headers.join(","),
      ...openUrlsData.data.map((item) =>
        [
          item.id,
          `"${item.first_name || ""}"`,
          `"${item.last_name || ""}"`,
          `"${item.email || ""}"`,
          `"${(item.matching_url || []).join("; ")}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create and download CSV file
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OpenUrls.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      onSearchChange.cancel();
    };
  }, [onSearchChange]);

  return (
    <div className="w-full px-4 py-1 bg-white rounded-3xl h-full overflow-hidden mt-2 shadow-custom">
      <div className="flex items-start text-start justify-between w-full mb-4">
        <div className="flex flex-col items-start text-start justify-start">
          <SearchField
            variant="auth"
            type="text"
            value={search}
            placeholder={t("searchbox.placeHolder")}
            onChange={handleSearchChange}
            name="url"
          />
          <p className="max-w-[300px] text-clip overflow-clip break-words my-2 text-sm">
            {t("messages.searchOpenUrlsDescription")}
          </p>
        </div>
        <button
          className={`w-[75px] disabled:cursor-not-allowed rounded-lg py-1 mt-3 mr-3 text-[14px] font-medium text-gray-11 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6]`}
          onClick={exportOpenUrlsHandler}
        >
          {t("clients.export")}
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-auto mb-12 w-full h-[90%]">
        {isFetchingOpenUrls && (
          <div className="h-full w-full flex justify-center items-center">
            <Loader />
          </div>
        )}
        {!isFetchingOpenUrls && openUrlsData.data && searchValue !== "" && (
          <table className="!table text-[12px] overflow-y-auto w-full">
            <thead className="sticky top-0 z-10 bg-[#F9FBFC]">
              <tr className=" pr-3 rounded-lg mb-5">
                <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-[16.5px]" : "text-[15px]"
                    }`}
                  >
                    {t("clients.id")}
                  </p>
                </th>
                <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-[16.5px]" : "text-[15px]"
                    }`}
                  >
                    {t("netfree.firstName")}
                  </p>
                </th>
                <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-[16.5px]" : "text-[15px]"
                    }`}
                  >
                    {t("netfree.lastName")}
                  </p>
                </th>
                <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-[16.5px]" : "text-[15px]"
                    }`}
                  >
                    {t("netfree.email")}
                  </p>
                </th>
                <th className="pl-5 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-[16.5px]" : "text-[15px]"
                    }`}
                  >
                    {t("netfree.urls")}
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="pt-5">
              {openUrlsData?.data?.length > 0
                ? openUrlsData?.data?.map((el, currentIndex) => {
                    return (
                      <tr
                        className=" border-t bottom-b border-sky-500 w-[100%]"
                        key={el.id}
                      >
                        <td className="py-5">
                          <p className="font-normal text-gray-11 break-words">
                            {el.id}
                          </p>
                        </td>
                        <td className="py-5">
                          <p className="font-normal text-gray-11 break-words">
                            {el.first_name}
                          </p>
                        </td>
                        <td className="py-5">
                          <p className="font-normal text-gray-11 break-words">
                            {el.last_name}
                          </p>
                        </td>
                        <td className="py-5">
                          <p className="font-normal text-gray-11 break-words">
                            {el.email}
                          </p>
                        </td>
                        <td className="py-5 min-w-[16rem] flex gap-x-3">
                          <p className="font-normal flex flex-wrap gap-1 text-gray-11 break-words w-[30rem]">
                            {el.matching_url?.map((url, idx) => (
                              <span
                                key={idx}
                                className="p-2 h-fit bg-gray-100 rounded-lg w-fit max-w-[20rem]"
                              >
                                {url}
                              </span>
                            ))}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OpenUrls;
