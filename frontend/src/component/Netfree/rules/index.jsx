import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RulesModal from "./RulesModal";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import rulesServices from "../../../services/rules";

// UI Components Imports
import SearchField from "../../fields/SearchField";
import EditButtonIcon from "../../common/EditButton";
import Loader from "../../common/Loader";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";

// Icon imports
import BinIcon from "../../../assets/images/bin.svg";
import { useSearch } from "../../../Hooks/useSearch";
import { HiXMark } from "react-icons/hi2";
import { RuleUrlsActionsList } from "../../../constants/rulesUtils";

const Rules = () => {
  const { t } = useTranslation();
  const [editRule, setEditRule] = useState(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  const {
    data: rulesData,
    isLoading: isLoadingRules,
    refetch,
  } = useQuery({
    queryKey: ["rulesList"],
    queryFn: () => {
      return rulesServices.getRules().then((res) => {
        return res.data;
      });
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: updateRuleHandler, isPending: isUpdatingRule } = useMutation({
    mutationKey: ["updateRule"],
    mutationFn: (data) => rulesServices.updateRulesData(data),
    onSuccess: () => {
      refetch();
    },
  });

  const { searchQuery, setSearchQuery, filteredItems } = useSearch(
    rulesData?.urls ?? [],
    ["url", "rule"],
    300
  );

  const handleCategorySelect = (event, newValue) => {
    const categoryList = rulesData?.category?.reduce((acc, curr) => {
      acc[curr.categories_id] = curr.rule;
      return acc;
    }, {});
    const data = {
      category_list: {
        ...categoryList,
        [newValue.value]: 1,
      },
      urls_data: rulesData?.urls,
    };
    setInputValue("");
    updateRuleHandler(data, {
      onSuccess: () => {
        toast.success(t("messages.ruleCategoryAddSuccess"));
      },
    });
  };

  const handleCategoryClick = (id, value) => {
    const initialCategoryList = rulesData?.category?.filter(
      (el) => el.categories_id !== id
    );
    const categoryList = initialCategoryList?.reduce((acc, curr) => {
      acc[curr.categories_id] = curr.rule;
      return acc;
    }, {});
    const data = {
      category_list: {
        ...categoryList,
        [id]: value,
      },
      urls_data: rulesData?.urls,
    };
    updateRuleHandler(data, {
      onSuccess: () => {
        toast.success(t("messages.ruleCategoryUpdateSuccess"));
      },
    });
  };

  const handleCategoryDelete = (id) => {
    const initialCategoryList = rulesData?.category?.filter(
      (el) => el.categories_id !== id
    );
    const categoryList = initialCategoryList?.reduce((acc, curr) => {
      acc[curr.categories_id] = curr.rule;
      return acc;
    }, {});
    const data = {
      category_list: categoryList,
      urls_data: rulesData?.urls,
    };
    updateRuleHandler(data, {
      onSuccess: () => {
        toast.success(t("messages.ruleCategoryDeleteSuccess"));
      },
    });
  };
  const handleUrlDelete = (id) => {
    const initialUrlsList = rulesData?.urls?.filter(
      (el, index) => index !== id
    );
    const data = {
      category_list: rulesData?.category?.reduce((acc, curr) => {
        acc[curr.categories_id] = curr.rule;
        return acc;
      }, {}),
      urls_data: initialUrlsList,
    };
    updateRuleHandler(data, {
      onSuccess: () => {
        toast.success(t("messages.ruleUrlDeleteSuccess"));
      },
    });
  };

  return (
    <div className="flex items-start gap-1 w-full h-full">
      {/* <div className="flex items-center justify-end w-full mb-4">
              <SearchField
                variant="auth"
                type="text"
                value={searchQuery}
                placeholder={t("searchbox.placeHolder")}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                name="url"
              />
              <button
                className={`disabled:cursor-not-allowed w-fit mb-2 ml-auto rounded-lg py-2 px-4 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
                onClick={() => {
                  setEditRule(null);
                  setShowRuleModal(!showRuleModal);
                }}
              >
                {t("netfree.addRule")}
              </button>
            </div> */}
      <div className="flex h-full w-full">
        <div className="overflow-x-auto overflow-y-auto w-full min-h-0 flex">
          {isLoadingRules && (
            <div className="h-full w-full flex justify-center items-center">
              <Loader />
            </div>
          )}
          {!isLoadingRules && rulesData && (
            <div className="grid grid-cols-2 gap-3 h-full w-full p-1">
              <div className="col-span-1 rounded-lg bg-white p-4 shadow-custom">
                <p className="text-gray-11 flex flex-col gap-2 font-medium text-xl">
                  {t("netfree.categories")}
                  <span className="text-gray-600 font-normal text-sm">
                    {t("messages.rulesCategoryDescription")}
                  </span>
                </p>
                <Autocomplete
                  className="my-4"
                  options={rulesData?.tags?.list?.map((el) => ({
                    label: el.name,
                    value: el.tag,
                    language: el.language,
                  }))}
                  getOptionLabel={(option) => option.label || ""}
                  onChange={handleCategorySelect}
                  value={null}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={inputValue}
                      placeholder={
                        t("searchbox.placeHolder") +
                        " " +
                        t("netfree.categories")
                      }
                      size="small"
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.tag === value.tag
                  }
                />
                {rulesData?.category && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {rulesData?.category.map((el) => (
                      <div
                        key={el.categories_id}
                        className={`${
                          el.rule === 1 ? "bg-green-200" : "bg-red-100"
                        } rounded-lg p-2`}
                      >
                        <p className="text-gray-11 flex items-center gap-2 font-medium text-sm">
                          <HiXMark
                            className="w-4 h-4 font-bold cursor-pointer"
                            onClick={() =>
                              handleCategoryDelete(el.categories_id)
                            }
                          />
                          <span
                            onClick={() =>
                              handleCategoryClick(
                                el.categories_id,
                                el.rule === 1 ? -1 : 1
                              )
                            }
                            className="text-gray-11 font-medium text-sm"
                          >
                            {el.name}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-1 rounded-lg bg-white p-4 shadow-custom">
                <p className="text-gray-11 flex flex-col gap-2 font-medium text-xl">
                  {t("netfree.urls")}
                  <span className="text-gray-600 font-normal text-sm">
                    {t("messages.ruleUrlsDescription")}
                  </span>
                </p>
                <div className="flex w-full items-center gap-2 mt-6">
                  <SearchField
                    variant="auth"
                    type="text"
                    inputClass="h-[40px] !mt-0 !rounded-md"
                    extra="w-[80%]"
                    showSearchIcon={false}
                    value={searchQuery}
                    placeholder={
                      t("searchbox.placeHolder") + " " + t("netfree.urls")
                    }
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className={`disabled:cursor-not-allowed w-fit ml-auto rounded-lg py-3 px-4 text-[13px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
                    onClick={() => {
                      setEditRule(null);
                      setShowRuleModal(!showRuleModal);
                    }}
                  >
                    {t("netfree.addRule")}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {rulesData?.urls && (
                    <div className="flex flex-col gap-2 mt-6">
                      {filteredItems.map((el, index) => (
                        <div key={index} className="my-1">
                          <p className="text-gray-11 flex items-center gap-2 font-medium text-sm">
                            <span
                              onClick={() =>
                                handleCategoryClick(
                                  el.categories_id,
                                  el.rule === 1 ? -1 : 1
                                )
                              }
                              className="text-gray-11 font-medium text-sm"
                            >
                              {el.url}
                            </span>
                            <span
                              className={`text-white font-medium text-sm rounded-lg p-1 ${
                                RuleUrlsActionsList.find(
                                  (rule) => rule.id === el.rule
                                )?.class
                              }`}
                            >
                              {t(
                                RuleUrlsActionsList.find(
                                  (rule) => rule.id === el.rule
                                )?.label
                              )}
                            </span>
                            <EditButtonIcon
                              extra="!w-3 !h-3"
                              onClick={() => {
                                setEditRule({
                                  id: index,
                                  url: el.url,
                                  rule: el.rule,
                                });
                                setShowRuleModal(true);
                              }}
                            />
                            <HiXMark
                              className="w-4 h-4 font-bold cursor-pointer"
                              onClick={() => handleUrlDelete(index)}
                            />
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {showRuleModal && (
          <RulesModal
            setShowModal={setShowRuleModal}
            editRule={editRule}
            setEditRule={setEditRule}
            updateRuleHandler={updateRuleHandler}
            rulesData={rulesData}
            onClick={() => {}}
            refetchRules={refetch}
          />
        )}
      </div>
    </div>
  );
};

export default Rules;
