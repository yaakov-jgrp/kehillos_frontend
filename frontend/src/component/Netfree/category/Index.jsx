// React imports
import { useEffect, useState } from "react";

// UI Components Imports
import SearchField from "../../fields/SearchField";
import ToggleSwitch from "../../common/ToggleSwitch";
import AddButtonIcon from "../../common/AddButton";
import ActionModal from "./ActionModal";
import ProfileModal from "./ProfileModal";
import StatusOption from "./StatusOption";

// Third part Imports
import { useTranslation } from "react-i18next";

// API services
import requestService from "../../../services/request";

// Icon imports
import { MdExpandMore } from "react-icons/md";

// Utils imports
import { deleteNetfreeStatus } from "../../../lib/CommonFunctions";
import Loader from "../../common/Loader";

const Categories = ({
  profilesList,
  categoriesData,
  handleSiteSearch,
  searchResult,
  handleUpdateCategory,
  defaultActionList,
  defaultStatus,
  defaultTraffic,
  updateDefaultTrafficHandler,
  defaultTrafficActions,
  trafficStatus,
  clickedAction,
  getCategoryData,
  isLoading,
  setTrafficAction,
  enableActionUpdate,
  setIsDefaultActionSelectOpen,
  openActionOptions,
  handleClickedAction,
  editSelectedAction,
  deleteAction,
  searchCategories,
  categoriesDataCopy,
}) => {
  const { t, i18n } = useTranslation();

  const ActionSelectBox = ({
    options,
    categoryName,
    categoryId,
    currentActions,
    operationType,
    previousValue,
  }) => {
    return (
      <div className="w-auto mx-3 mt-1">
        <select
          onChange={(e) =>
            operationType === "edit"
              ? editAction(
                  categoryId,
                  currentActions,
                  previousValue,
                  e.target.value
                )
              : updateAction(
                  { id: categoryId, to_add: Number(e.target.value) },
                  null
                )
          }
          placeholder="Select Action"
          value={"selectAction"}
          className="bg-white border-[1px] py-1 px-2 outline-none rounded-md"
          onBlur={() =>
            editSelectedAction(categoryId, { label: "close edit options" })
          }
        >
          <option value={"selectAction"} disabled>
            Select Action
          </option>
          {options?.map((el) => {
            return el ? (
              <option key={categoryName + el.id} value={el.id}>
                {el.label}
              </option>
            ) : null;
          })}
        </select>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto overflow-y-auto mb-12 w-full h-[30rem]">
      {isLoading && (
        <div className="flex justify-center items-center w-full h-full">
          <span className="circle animate-loader"></span>
          <span className="circle animate-loader animation-delay-200"></span>
          <span className="circle animate-loader animation-delay-400"></span>
        </div>
      )}
      {!isLoading && categoriesData && (
        <table className="!table text-[12px] overflow-y-auto w-full">
          <thead className="sticky top-0 z-10 bg-[#F9FBFC]">
            <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
            <tr className="pr-3 rounded-lg mb-5">
              <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                <p className="text-start text-gray-11 font-medium text-sm">
                  {t("netfree.name")}
                </p>
                <SearchField
                  variant="auth"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) =>
                    searchCategories(e.target.value, categoriesDataCopy, "name")
                  }
                  name="name"
                />
              </th>
              <th className="pl-5 pt-2 pb-4">
                <p className="text-start text-gray-11 font-medium text-sm">
                  {t("netfree.actions")}
                </p>
                <SearchField
                  variant="auth"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) =>
                    searchCategories(
                      e.target.value,
                      categoriesDataCopy,
                      "actions"
                    )
                  }
                  name="actions"
                />
              </th>
            </tr>
          </thead>
          <tbody className="pt-5">
            {categoriesData.map((el, currentIndex) => {
              return (
                <tr
                  className="h-[20px] border-b border-sky-500 w-[100%]"
                  key={el.categories_id}
                >
                  <td>
                    <h5 className="font-medium text-gray-11 break-words w-[15rem] py-2 text-sm">
                      {el.name}
                    </h5>
                  </td>
                  <td className="pl-5 pr-5 flex gap-2 py-[6px] my-2">
                    {el.actions.map((action, index) => {
                      return action.label.length ? (
                        action.isActionEditOn ? (
                          <ActionSelectBox
                            options={actionsList.map((item) =>
                              !el.actions.some((el) => el.label === item.label)
                                ? item
                                : null
                            )}
                            categoryName={el.name}
                            categoryId={el.categories_id}
                            currentActions={actionsList.map((item, index) =>
                              el.actions.some((el) => el.label === item.label)
                                ? item.id
                                : null
                            )}
                            operationType="edit"
                            previousValue={action.label}
                          />
                        ) : (
                          <div
                            key={action + index}
                            className="px-3 relative py-1 bg-[#F2F8FB] rounded-full flex gap-2 whitespace-nowrap text-gray-10 font-medium"
                          >
                            {action.label}
                            <span
                              onClick={() => {
                                openActionOptions(currentIndex, action);
                                handleClickedAction(action?.id);
                              }}
                            >
                              <MdExpandMore className="h-5 w-5 text-gray-10 cursor-pointer" />
                            </span>
                            {clickedAction == action?.id && (
                              <div
                                className={`absolute top-[20px] z-10 drop-shadow-md bg-white cursor-pointer ${
                                  i18n.dir() === "rtl"
                                    ? "left-[-15px]"
                                    : "right-[-15px]"
                                }`}
                              >
                                {(action.label.includes(
                                  "Send email template"
                                ) ||
                                  action.label.includes(
                                    "שלח תבנית אימייל"
                                  )) && (
                                  <div
                                    className="py-1 px-3 border-b-[1px] hover:bg-[#f2f3f5]"
                                    onClick={() =>
                                      editSelectedAction(el, action)
                                    }
                                  >
                                    {t("netfree.edit")}
                                  </div>
                                )}
                                <div
                                  className="py-1 px-3 hover:bg-[#f2f3f5]"
                                  onClick={() =>
                                    deleteAction(el.categories_id, action.id)
                                  }
                                >
                                  {t("netfree.remove")}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      ) : null;
                    })}
                    {el.request_status && (
                      <StatusOption
                        getData={getCategoryData}
                        dataValue={el}
                        deleteStatusFn={(statusId) =>
                          requestService.deleteCategoryStatus(statusId)
                        }
                      />
                    )}
                    {
                      <AddButtonIcon
                        extra={""}
                        onClick={() => {
                          setTrafficAction(false);
                          enableActionUpdate(el);
                          setIsDefaultActionSelectOpen(false);
                        }}
                      />
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Categories;
