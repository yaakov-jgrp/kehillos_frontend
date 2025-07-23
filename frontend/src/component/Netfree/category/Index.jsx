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
  categoryFilter,
  actionsList,
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
  currentSearchTerm,
  setCurrentSearchTerm,
  currentActionSearchTerm,
  setCurrentActionSearchTerm,
  writePermission,
}) => {
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  // const [showActionModal, setShowActionModal] = useState(false);
  // const [clickedAction, setClickedAction] = useState(null);
  // const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = useState(0);
  // const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  // const [siteSearch, setSiteSearch] = useState("");
  // const [editActionID, setEditActionId] = useState(null);
  // const [defaultTraffic, setDefaultTraffic] = useState(null);
  // const [profilesList, setProfilesList] = useState(null);
  // const [profileActiveIndex, setProfileActiveIndex] = useState(0);
  // const [activeProfile, setActiveprofile] = useState(null);
  // const [showProfileModal, setShowProfileModal] = useState(false);
  // const [newProfile, setNewProfile] = useState(true);
  // const [trafficAction, setTrafficAction] = useState(false);
  // const [defaultTrafficActions, setDefaultTrafficActions] = useState([]);
  // const [defaultStatus, setDefaultStatus] = useState(null);
  // const [trafficStatus, setTrafficStatus] = useState(null);
  // const defaultLanguageValue = localStorage.getItem("DEFAULT_LANGUAGE");
  // const setResponseDataToState = (res) => {
  //   const response = res.data.data.map((el) => {
  //     el.isActionUpdateEnabled = false;
  //     el.actions = el.actions.map((item) => {
  //       return { isClicked: false, isActionEditOn: false, ...item };
  //     });
  //     return el;
  //   });
  //   setCategoriesData(response);
  //   setCategoriesDataCopy(response);
  //   if (siteSearch) {
  //     searchCategories(siteSearch, response);
  //   } else {
  //     searchCategories(currentSearchTerm, response, "name");
  //   }
  // };

  // const getCategoryData = async () => {
  //   setIsLoading(true);
  //   const response = await categoryService.getCategories();
  //   setResponseDataToState(response);
  //   setIsLoading(false);
  // };

  // const getDefaultActions = async () => {
  //   const response = await categoryService.getDefaultAction();
  //   setDefaultActionList(response.data.data);
  // };
  // const getDefaultTraffic = async () => {
  //   const response = await categoryService.getDefaultTraffic();
  //   setDefaultTraffic(response.data.data.is_active);
  // };

  // const getDefaultTrafficActions = async () => {
  //   const response = await categoryService.getDefaultTrafficActions();
  //   setDefaultTrafficActions(response.data.data);
  // };

  // const updateDefaultTrafficHandler = async () => {
  //   const data = {
  //     status: !defaultTraffic,
  //   };
  //   const response = await categoryService.updateNetfreeTraffic(data);
  //   setDefaultTraffic(response.data.data.is_active);
  // };

  // const deleteDefaultAction = async (actionId) => {
  //   setIsLoading(true);
  //   await categoryService.deleteDefaultAction(actionId);
  //   await getDefaultTrafficActions();
  //   getCategoryData();
  //   await getActionsList();
  //   setIsLoading(false);
  // };

  // const getActionsList = async () => {
  //   getDefaultActions().then(async () => {
  //     const defaultStatusResponse = await categoryService.getDefaultStatus();
  //     const trafficStatusResponse = await categoryService.getTrafficStatus();
  //     setDefaultStatus(defaultStatusResponse.data.data[0]);
  //     setTrafficStatus(trafficStatusResponse.data.data[0]);
  //     const response = await categoryService.getActions();
  //     setActionsList(response.data.data);
  //   });
  // };

  // const handleUpdateCategory = () => {
  //   categoryService.updateCategories();
  // };

  // const enableActionUpdate = (element) => {
  //   if (element) {
  //     setCurrentSelectedCategoryId(element);
  //   }
  //   setShowActionModal(true);
  // };

  // const updateAction = async (data, id) => {
  //   setIsLoading(true);
  //   await categoryService.updateActionInCategory(data, id);
  //   if (siteSearch) {
  //     searchSetting(siteSearch);
  //   } else {
  //     getCategoryData();
  //   }
  //   setIsLoading(false);
  // };

  // const deleteAction = (categoryId, actionToRemove) => {
  //   setIsLoading(true);
  //   updateAction({ id: categoryId, to_remove: actionToRemove }, null);
  //   setIsLoading(false);
  // };

  // // update/edit action value
  // const editAction = (categoryId, currentActions, actionToRemove, newValue) => {
  //   setIsLoading(true);
  //   updateAction({ id: categoryId, to_add: newValue }, null);
  //   setIsLoading(false);
  // };

  // //make current action editable
  // const editSelectedAction = (categoyId, action) => {
  //   setCurrentSelectedCategoryId(categoyId);
  //   setEditActionId(action.id);
  //   setShowActionModal(true);
  // };

  // const searchCategories = (searchTerm, response, type) => {
  //   setCurrentSearchTerm(searchTerm);
  //   if (siteSearch) {
  //     setCategoriesData(response);
  //   } else if (currentSearchTerm) {
  //     let filteredData = [];
  //     if (type === "name") {
  //       filteredData = response?.filter((el) =>
  //         el[type].toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //     } else {
  //       filteredData = response?.filter(
  //         (el) =>
  //           el.actions?.filter((action) =>
  //             action.label.toLowerCase().includes(searchTerm.toLowerCase())
  //           ).length > 0
  //       );
  //     }
  //     if (searchTerm === "") {
  //       filteredData = response;
  //     }
  //     setCategoriesData(filteredData);
  //   } else {
  //     setCategoriesData(response);
  //   }
  // };

  // const searchSetting = async (query) => {
  //   setIsLoading(true);
  //   setSiteSearch(query);
  //   const response = await categoryService.searchSiteSetting(query);
  //   if (query.length) {
  //     setSearchResult(response.data.data);
  //   } else {
  //     setSearchResult([]);
  //   }
  //   setResponseDataToState(response);
  //   setIsLoading(false);
  // };

  // const handleSiteSearch = debounce((e) => searchSetting(e.target.value), 500);

  // const handleClickedAction = (id) => {
  //   if (clickedAction && clickedAction === id) {
  //     setClickedAction(null);
  //   } else {
  //     setClickedAction(id);
  //   }
  // };

  // const openActionOptions = (categoyIndex, action) => {
  //   let updatedCategoryData = JSON.parse(JSON.stringify(categoriesData));
  //   updatedCategoryData.forEach((el, ind) => {
  //     if (ind === categoyIndex) {
  //       el.actions = el.actions.map((item) => {
  //         item.label === action.label
  //           ? (item.isClicked = !item.isClicked)
  //           : (item.isClicked = false);
  //         return item;
  //       });
  //     }
  //   });
  //   setCategoriesData(updatedCategoryData);
  // };

  // const setDefaultAction = async (actionId, data) => {
  //   setIsLoading(true);
  //   const actionsPayload = defaultActionList.map((el) => el.id);
  //   const params = trafficAction ? "&is_netfree_traffic=true" : "";
  //   await categoryService.setDefaultAction(
  //     { actions: [...actionsPayload, actionId], ...data },
  //     params
  //   );
  //   await getDefaultTrafficActions();
  //   getCategoryData();
  //   setIsDefaultActionSelectOpen(false);
  //   await getActionsList();
  //   setIsLoading(false);
  // };

  // const getAllProfilesListHandler = async () => {
  //   const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  //   const profilesListData = await categoryService.getProfilesList();
  //   const defaultProfile = profilesListData.data.data.filter(
  //     (profile) => profile.is_default
  //   );
  //   if (!filterProfileID) {
  //     localStorage.setItem("FILTER_PROFILE_ID", defaultProfile[0]?.id ?? 1);
  //   }
  //   const nonDefaultProfiles = profilesListData.data.data.filter(
  //     (profile) => !profile.is_default
  //   );
  //   const listsData = [...defaultProfile, ...nonDefaultProfiles];
  //   const profileIndex = localStorage.getItem("PROFILE_INDEX");
  //   setProfilesList(listsData);
  //   if (profileIndex && profileIndex < listsData.length) {
  //     setProfileActiveIndex(profileIndex);
  //     setActiveprofile(listsData[profileIndex]);
  //   } else {
  //     setActiveprofile(listsData[0]);
  //   }
  // };

  // const profileClickHandler = (index) => {
  //   const newActiveProfile = profilesList?.filter((profile, i) => i === index);
  //   localStorage.setItem("FILTER_PROFILE_ID", newActiveProfile[0].id);
  //   localStorage.setItem("PROFILE_INDEX", index);
  //   setActiveprofile(newActiveProfile[0]);
  //   setProfileActiveIndex(index);
  //   setNewProfile(false);
  //   getCategoryData();
  //   getActionsList();
  //   getDefaultTraffic();
  //   getDefaultTrafficActions();
  // };

  // const editProfileHandler = () => {
  //   setNewProfile(false);
  //   setShowProfileModal(!showProfileModal);
  // };

  // const deleteProfileHandler = async () => {
  //   const res = await categoryService.deleteProfile(activeProfile.id);
  //   const updatedProfiles = profilesList.filter(
  //     (profile) => profile.id !== activeProfile.id
  //   );
  //   const activeIndex = profilesList.findIndex(
  //     (profile) => profile.id === activeProfile.id
  //   );
  //   profileClickHandler(activeIndex - 1);
  //   setProfilesList(updatedProfiles);
  //   setProfileActiveIndex(activeIndex - 1);
  //   setActiveprofile(updatedProfiles[activeIndex - 1]);
  // };

  // const duplicateProfileHandler = async () => {
  //   const res = await categoryService.duplicateProfile(activeProfile);
  //   getAllProfilesListHandler();
  // };

  // useEffect(() => {
  //   getAllProfilesListHandler();
  //   getCategoryData();
  //   getActionsList();
  //   getDefaultTrafficActions();
  //   getDefaultTraffic();
  // }, [defaultLanguageValue]);

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
    <div className="overflow-x-auto overflow-y-auto w-full min-h-[30vh]">
      {isLoading && <Loader className="!min-h-fit" />}
      {!isLoading && categoriesData && (
        <table className="!table text-[12px] overflow-y-auto w-full">
          <thead className="sticky top-0 z-10 bg-[#F9FBFC]">
            <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
            <tr className="pr-3 rounded-lg mb-5">
              <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                <p
                  className={`text-start text-gray-11 font-medium  ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("netfree.name")}
                </p>
                <SearchField
                  value={currentSearchTerm}
                  variant="auth"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => {
                    localStorage.setItem("currentSearchTerm", e.target.value);
                    setCurrentSearchTerm(e.target.value);
                    searchCategories(
                      e.target.value,
                      categoriesDataCopy,
                      "name"
                    );
                  }}
                  name="name"
                />
              </th>
              <th className="pl-5 pt-2 pb-4">
                <p
                  className={`text-start text-gray-11 font-medium ${
                    lang === "he" ? "text-[16.5px]" : "text-[15px]"
                  }`}
                >
                  {t("netfree.actions")}
                </p>
                <SearchField
                  value={currentActionSearchTerm}
                  variant="auth"
                  type="text"
                  placeholder={t("searchbox.placeHolder")}
                  onChange={(e) => {
                    localStorage.setItem(
                      "currentActionSearchTerm",
                      e.target.value
                    );
                    setCurrentActionSearchTerm(e.target.value);
                    searchCategories(
                      e.target.value,
                      categoriesDataCopy,
                      "actions"
                    );
                  }}
                  name="actions"
                />
              </th>
            </tr>
          </thead>
          <tbody className="pt-5">
            {categoriesData
              .filter((el) => {
                if (categoryFilter === "with_actions") {
                  return el.actions.length > 0;
                }
                return true;
              })
              .map((el, currentIndex) => {
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
                                !el.actions.some(
                                  (el) => el.label === item.label
                                )
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
                          extra={
                            writePermission
                              ? "hover:cursor-not-allowed"
                              : "hover:cursor-pointer"
                          }
                          onClick={
                            writePermission
                              ? () => {}
                              : () => {
                                  setTrafficAction(false);
                                  enableActionUpdate(el);
                                  setIsDefaultActionSelectOpen(false);
                                }
                          }
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
