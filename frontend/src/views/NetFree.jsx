// React imports
import { useEffect, useState } from "react";

// UI Components Imports
import Categories from "../component/Netfree/category/Index";
import Websites from "../component/Netfree/Websites";
import NetfreeTabs from "../component/Netfree/NetfreeTabs";
import { useTranslation } from "react-i18next";
import SearchField from "../component/fields/SearchField";
import CustomSearchField from "../component/fields/CustomSearchField";
import AddIcon from "../assets/images/add.svg";
import categoryService from "../services/category";
import TooltipButtonIcon from "../component/common/TootltipButton";
import EditButtonIcon from "../component/common/EditButton";
import { HiDuplicate } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import ActionModal from "../component/Netfree/category/ActionModal";
import ProfileModal from "../component/Netfree/category/ProfileModal";
import { debounce } from "lodash";
import Loader from "../component/common/Loader";
import AddButtonIcon from "../component/common/AddButton";
import ToggleSwitch from "../component/common/ToggleSwitch";
import RedCrossIcon from "../assets/images/red_cross.svg";
import InfoIcon from "../assets/images/info.svg";
import BinIcon from "../assets/images/bin.svg";
import ContentCopyIcon from "../assets/images/content_copy.svg";
import BlueDownArrowIcon from "../assets/images/blue_down_arrow.svg";
import { categoryFilters } from "../lib/FieldConstants";
import { MenuItem, Select } from "@mui/material";
import { deleteNetfreeStatus } from "../lib/CommonFunctions";
import { USER_DETAILS } from "../constants";

const NetFree = () => {
  const [tab, setTab] = useState(0);
  const [currentTab, setCurrentTab] = useState("categories");
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoriesDataCopy, setCategoriesDataCopy] = useState([]);
  const [actionsList, setActionsList] = useState([]);
  const [defaultActionList, setDefaultActionList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isDefaultActionSelectOpen, setIsDefaultActionSelectOpen] =
    useState(false);
  const { t, i18n } = useTranslation();
  const [showActionModal, setShowActionModal] = useState(false);
  const [clickedAction, setClickedAction] = useState(null);
  const [currentSelectedCategoryId, setCurrentSelectedCategoryId] = useState(0);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(
    localStorage.getItem("currentSearchTerm") || ""
  );
  const [currentActionSearchTerm, setCurrentActionSearchTerm] = useState(
    localStorage.getItem("currentActionSearchTerm") || ""
  );
  const [siteSearch, setSiteSearch] = useState("");
  const [editActionID, setEditActionId] = useState(null);
  const [defaultTraffic, setDefaultTraffic] = useState(null);
  const [profilesList, setProfilesList] = useState(null);
  const [profileActiveIndex, setProfileActiveIndex] = useState(0);
  const [activeProfile, setActiveprofile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newProfile, setNewProfile] = useState(true);
  const [trafficAction, setTrafficAction] = useState(false);
  const [defaultTrafficActions, setDefaultTrafficActions] = useState([]);
  const [defaultStatus, setDefaultStatus] = useState(null);
  const [trafficStatus, setTrafficStatus] = useState(null);
  const defaultLanguageValue = localStorage.getItem("DEFAULT_LANGUAGE");
  const NetfreePageTabs = [t("netfree.categories"), t("netfree.websites")];
  const [currentProfileTab, setCurrentProfileTab] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const permissionsObjects =
    JSON.parse(localStorage.getItem("permissionsObjects")) || {};
  const netfreePermission = permissionsObjects?.netfreePermission;
  const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS)) || {};
  const organizationAdmin = userDetails?.organization_admin;
  const writePermission = organizationAdmin
    ? false
    : netfreePermission
    ? !netfreePermission?.is_write
    : false;
  const updatePermission = organizationAdmin
    ? false
    : netfreePermission
    ? !netfreePermission?.is_update
    : false;
  const deletePermission = organizationAdmin
    ? false
    : netfreePermission
    ? !netfreePermission?.is_delete
    : false;

  // Handlers

  const handleChange = (e, value) => {
    setTab(value);
  };

  const handleCurrentProfileTabChange = (e, value) => {
    setCurrentProfileTab(value);
    profileClickHandler(value);
  };

  const setResponseDataToState = (res) => {
    const response = res.data.data.map((el) => {
      el.isActionUpdateEnabled = false;
      el.actions = el.actions.map((item) => {
        return { isClicked: false, isActionEditOn: false, ...item };
      });
      return el;
    });
    setCategoriesData(response);
    setCategoriesDataCopy(response);
    if (siteSearch) {
      searchCategories(siteSearch, response);
    } else {
      if (currentSearchTerm) {
        searchCategories(currentSearchTerm, response, "name");
      }
      if (currentActionSearchTerm) {
        searchCategories(currentActionSearchTerm, response, "actions");
      }
    }
  };

  const getCategoryData = async () => {
    setIsLoading(true);
    const params = `&filter=${categoryFilter}`;
    const response = await categoryService.getCategories(params);
    setResponseDataToState(response);
    setIsLoading(false);
  };

  const getDefaultActions = async () => {
    const response = await categoryService.getDefaultAction();
    setDefaultActionList(response.data.data);
  };

  const getDefaultTraffic = async () => {
    const response = await categoryService.getDefaultTraffic();
    setDefaultTraffic(response.data.data.is_active);
  };

  const getDefaultTrafficActions = async () => {
    const response = await categoryService.getDefaultTrafficActions();
    setDefaultTrafficActions(response.data.data);
  };

  const updateDefaultTrafficHandler = async () => {
    const data = {
      status: !defaultTraffic,
    };
    const response = await categoryService.updateNetfreeTraffic(data);
    setDefaultTraffic(response.data.data.is_active);
  };

  const deleteDefaultAction = async (actionId) => {
    setIsLoading(true);
    await categoryService.deleteDefaultAction(actionId);
    await getDefaultTrafficActions();
    getCategoryData();
    await getActionsList();
    setIsLoading(false);
  };

  const getActionsList = async () => {
    getDefaultActions().then(async () => {
      const defaultStatusResponse = await categoryService.getDefaultStatus();
      const trafficStatusResponse = await categoryService.getTrafficStatus();
      setDefaultStatus(defaultStatusResponse.data.data[0]);
      setTrafficStatus(trafficStatusResponse.data.data[0]);
      const response = await categoryService.getActions();
      setActionsList(response.data.data);
    });
  };

  const handleUpdateCategory = () => {
    categoryService.updateCategories();
  };

  const enableActionUpdate = (element) => {
    if (element) {
      setCurrentSelectedCategoryId(element);
    }
    setShowActionModal(true);
  };

  const updateAction = async (data, id) => {
    setIsLoading(true);
    await categoryService.updateActionInCategory(data, id);
    if (siteSearch) {
      searchSetting(siteSearch);
    } else {
      getCategoryData();
    }
    setIsLoading(false);
  };

  const deleteAction = (categoryId, actionToRemove) => {
    setIsLoading(true);
    updateAction({ id: categoryId, to_remove: actionToRemove }, null);
    setIsLoading(false);
  };

  // update/edit action value
  const editAction = (categoryId, currentActions, actionToRemove, newValue) => {
    setIsLoading(true);
    updateAction({ id: categoryId, to_add: newValue }, null);
    setIsLoading(false);
  };

  //make current action editable
  const editSelectedAction = (categoyId, action) => {
    setCurrentSelectedCategoryId(categoyId);
    setEditActionId(action.id);
    setShowActionModal(true);
  };

  const searchCategories = (searchTerm, response, type) => {
    if (siteSearch) {
      setCategoriesData(response);
    } else if (currentSearchTerm || currentActionSearchTerm) {
      let filteredData = [];
      if (type === "name") {
        filteredData = response?.filter((el) =>
          el[type].toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
      } else {
        filteredData = response?.filter(
          (el) =>
            el.actions?.filter((action) =>
              action.label
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase())
            ).length > 0
        );
      }
      if (searchTerm === "") {
        filteredData = response;
      }
      setCategoriesData(filteredData);
    } else {
      setCategoriesData(response);
    }
  };

  const searchSetting = async (query) => {
    setIsLoading(true);
    setSiteSearch(query);
    const response = await categoryService.searchSiteSetting(query);
    if (query.length) {
      setSearchResult(response.data.data);
    } else {
      setSearchResult([]);
    }
    setResponseDataToState(response);
    setIsLoading(false);
  };

  const handleSiteSearch = debounce((e) => searchSetting(e.target.value), 500);

  const handleClickedAction = (id) => {
    if (clickedAction && clickedAction === id) {
      setClickedAction(null);
    } else {
      setClickedAction(id);
    }
  };

  const openActionOptions = (categoyIndex, action) => {
    let updatedCategoryData = JSON.parse(JSON.stringify(categoriesData));
    updatedCategoryData.forEach((el, ind) => {
      if (ind === categoyIndex) {
        el.actions = el.actions.map((item) => {
          item.label === action.label
            ? (item.isClicked = !item.isClicked)
            : (item.isClicked = false);
          return item;
        });
      }
    });

    setCategoriesData(updatedCategoryData);
  };

  const setDefaultAction = async (actionId, data) => {
    setIsLoading(true);
    const actionsPayload = defaultActionList.map((el) => el.id);
    const params = trafficAction ? "&is_netfree_traffic=true" : "";
    await categoryService.setDefaultAction(
      { actions: [...actionsPayload, actionId], ...data },
      params
    );
    await getDefaultTrafficActions();
    getCategoryData();
    setIsDefaultActionSelectOpen(false);
    await getActionsList();
    setIsLoading(false);
  };

  const getAllProfilesListHandler = async () => {
    const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
    const profilesListData = await categoryService.getProfilesList();
    const defaultProfile = profilesListData.data.data.filter(
      (profile) => profile.is_default
    );
    if (!filterProfileID) {
      localStorage.setItem("FILTER_PROFILE_ID", defaultProfile[0]?.id ?? 1);
    }
    const nonDefaultProfiles = profilesListData.data.data.filter(
      (profile) => !profile.is_default
    );
    const listsData = [...defaultProfile, ...nonDefaultProfiles];
    const profileIndex = localStorage.getItem("PROFILE_INDEX");
    setProfilesList(listsData);
    if (profileIndex && profileIndex < listsData.length) {
      setProfileActiveIndex(profileIndex);
      setActiveprofile(listsData[profileIndex]);
    } else {
      setActiveprofile(listsData[0]);
    }
  };

  const profileClickHandler = (index) => {
    const newActiveProfile = profilesList?.filter((profile, i) => i === index);
    localStorage.setItem("FILTER_PROFILE_ID", newActiveProfile[0].id);
    localStorage.setItem("PROFILE_INDEX", index);
    setActiveprofile(newActiveProfile[0]);
    setProfileActiveIndex(index);
    setNewProfile(false);
    getCategoryData();
    getActionsList();
    getDefaultTraffic();
    getDefaultTrafficActions();
  };

  const editProfileHandler = () => {
    setNewProfile(false);
    setShowProfileModal(!showProfileModal);
  };

  const deleteProfileHandler = async () => {
    const res = await categoryService.deleteProfile(activeProfile.id);
    const updatedProfiles = profilesList.filter(
      (profile) => profile.id !== activeProfile.id
    );
    const activeIndex = profilesList.findIndex(
      (profile) => profile.id === activeProfile.id
    );
    profileClickHandler(activeIndex - 1);
    setCurrentProfileTab(activeIndex - 1);
    setProfilesList(updatedProfiles);
    setProfileActiveIndex(activeIndex - 1);
    setActiveprofile(updatedProfiles[activeIndex - 1]);
  };

  const duplicateProfileHandler = async () => {
    const res = await categoryService.duplicateProfile(activeProfile);
    getAllProfilesListHandler();
  };

  // Effects
  useEffect(() => {
    const currentTabValue = localStorage.getItem("CURRENT_NETFREE_TAB");
    if (currentTabValue) {
      setCurrentTab(currentTabValue);
    }
  }, []);

  useEffect(() => {
    getAllProfilesListHandler();
    getCategoryData();
    getActionsList();
    getDefaultTrafficActions();
    getDefaultTraffic();
  }, [defaultLanguageValue]);

  useEffect(() => {
    getCategoryData();
  }, [categoryFilter]);

  return (
    <div className="flex flex-col gap-3">
      <div className="shadow-custom rounded-lg px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-gray-11 font-medium text-2xl">
            {t("netfree.title")}
          </p>
          <div className="flex items-center gap-1">
            <CustomSearchField
              variant="auth"
              extra="mb-[10px] -mt-[14px] px-3"
              id="dateCreated"
              type="text"
              placeholder={t("searchbox.placeHolder")}
              onChange={handleSiteSearch}
              name="dateCreated"
              noUnderline="true"
              borderRadius="30"
            />
            <button
              disabled={writePermission}
              className={`w-[140px] disabled:cursor-not-allowed rounded-lg py-2 px-2 text-[14px] font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center items-center border border-[#E3E5E6] gap-2`}
              onClick={() => {
                setShowProfileModal(!showProfileModal);
                setNewProfile(true);
              }}
            >
              <img src={AddIcon} alt="add_icon" />
              {t("netfree.addProfile")}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="px-2">
            {/* <ul
              className={`${
                defaultLanguageValue === "he" ? "pl-[150px]" : "pr-[150px]"
              } overflow-x-auto scrollbar-hide flex text-sm font-medium text-center`}
            >
              {profilesList &&
                profilesList.length > 0 &&
                profilesList.map((profile, index) => {
                  return (
                    <li key={index}>
                      <a
                        onClick={() => profileClickHandler(index)}
                        className={`mr-1 w-max inline-block cursor-pointer capitalize p-1 px-2 ${
                          profileActiveIndex == index
                            ? "text-gray-11"
                            : "text-gray-10"
                        } rounded-full ${
                          profileActiveIndex == index
                            ? "dark:bg-gray-800 bg-gray-100 dark:text-blue-500"
                            : "hover:text-gray-11 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        }`}
                      >
                        {profile.name}
                      </a>
                    </li>
                  );
                })}
            </ul> */}
            {profilesList && profilesList.length > 0 && (
              <NetfreeTabs
                currentTab={currentProfileTab}
                handleTabChange={handleCurrentProfileTabChange}
                tabsArray={profilesList.map((profile) => profile.name)}
              />
            )}
          </div>

          {activeProfile && (
            <div className="bg-[#F2F8FB] flex justify-between items-center px-4 py-3 rounded-lg overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="capitalize font-medium text-gray-11 text-2xl">
                    {t("netfree.filterProfile") + " " + activeProfile.name}
                  </p>
                  <img
                    src={InfoIcon}
                    alt="InfoIcon"
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex">
                  <p className="text-gray-11 text-md">
                    {activeProfile.description}
                  </p>
                </div>
                <p className="text-sm text-gray-10">
                  {t("netfree.lastUpdatedAt") +
                    " " +
                    dayjs(activeProfile.updated_at).format(
                      "MMM DD, YYYY HH:mm A"
                    )}
                </p>
              </div>
              <div className="h-auto flex items-center gap-2">
                <EditButtonIcon
                  extra={
                    updatePermission
                      ? "hover:cursor-not-allowed"
                      : "hover:cursor-pointer"
                  }
                  onClick={updatePermission ? () => {} : editProfileHandler}
                />
                <img
                  src={ContentCopyIcon}
                  alt="ContentCopyIcon"
                  onClick={writePermission ? () => {} : duplicateProfileHandler}
                  className={`${
                    writePermission ? "cursor-not-allowed" : "cursor-pointer"
                  } w-5`}
                />
                {!activeProfile.is_default && (
                  <img
                    src={BinIcon}
                    alt="BinIcon"
                    className={`${
                      deletePermission ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={deletePermission ? () => {} : deleteProfileHandler}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {/* <div className="flex justify-center items-center rounded-3xl text-center text-[#2B3674]">
          <button
            onClick={handleUpdateCategory}
            className={`linear p-1 w-[90%] rounded-full py-[4px] text-[14px] font-small transition duration-200 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
          >
            {t("netfree.updateCategoryButton")}
          </button>
        </div> */}
        <div className="bg-white shadow-custom rounded-2xl flex-[0.5]">
          <div className="flex items-center justify-between border-b border-b-[#F2F2F2] py-2 px-4">
            <h5 className="font-medium text-[16px] text-gray-11">
              {t("netfree.defaultAction")}
            </h5>
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
                      setIsDefaultActionSelectOpen(true);
                      setTrafficAction(false);
                      enableActionUpdate();
                    }
              }
            />
          </div>
          <div className="h-[110px] scrollbar-hide">
            <div className="flex flex-wrap gap-2 pt-3 px-4">
              {defaultActionList.map((el) => {
                return (
                  <div
                    key={el.id}
                    className="text-gray-10 font-medium whitespace-break-spaces text-[12px] relative bg-[#F2F8FB] rounded-full flex gap-2 p-2"
                  >
                    {el.label}
                    <img
                      onClick={() => deleteDefaultAction(el.id)}
                      className="cursor-pointer w-[10px] -mt-[0.8px]"
                      src={RedCrossIcon}
                      alt="RedCrossIcon"
                    />
                  </div>
                );
              })}
              {defaultStatus && (
                <div className="text-gray-10 font-medium whitespace-break-spaces text-[12px] mb-2 relative py-1 px-4 bg-[#F4F7FE] rounded-full flex gap-2">
                  {defaultStatus.email_request_status.label}
                  <img
                    onClick={() =>
                      deleteNetfreeStatus(defaultStatus.id, getActionsList)
                    }
                    className="cursor-pointer"
                    src={RedCrossIcon}
                    alt="RedCrossIcon"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {defaultTraffic !== null && (
          <div className="bg-white shadow-custom rounded-2xl flex-[0.5]">
            <div className="flex items-center justify-between border-b border-b-[#F2F2F2] py-2 px-4">
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  disabled={writePermission}
                  clickHandler={
                    writePermission ? () => {} : updateDefaultTrafficHandler
                  }
                  selected={defaultTraffic}
                />
                <h5 className="font-medium text-[16px] text-gray-11">
                  {t("netfree.trafficRecord")}
                </h5>
              </div>
              <AddButtonIcon
                extra={
                  writePermission
                    ? "hover:cursor-not-allowed"
                    : "hover:cursor-pointer"
                }
                onClick={writePermission ? ()=>{} : () => {
                  setIsDefaultActionSelectOpen(true);
                  setTrafficAction(true);
                  enableActionUpdate();
                }}
              />
            </div>
            <div className="h-[110px] scrollbar-hide">
              <div className="flex flex-wrap gap-2 pt-3 px-4">
                {defaultTrafficActions.map((el) => {
                  return (
                    <div
                      key={el.id}
                      className="text-gray-10 font-medium whitespace-break-spaces text-[12px] relative bg-[#F2F8FB] rounded-full flex gap-2 p-2"
                    >
                      {el.label}
                      <img
                        onClick={deletePermission ? ()=>{} : () => deleteDefaultAction(el.id)}
                        className={`${deletePermission ? 'cursor-not-allowed' : 'cursor-pointer'} w-[10px] -mt-[0.8px]`}
                        src={RedCrossIcon}
                        alt="RedCrossIcon"
                      />
                    </div>
                  );
                })}
                {trafficStatus && (
                  <div className="text-gray-10 font-medium whitespace-break-spaces text-[12px] mb-2 relative py-1 px-4 bg-[#F4F7FE] rounded-full flex gap-2">
                    {trafficStatus.email_request_status.label}
                    <img
                      onClick={deletePermission ? ()=>{} : () =>
                        deleteNetfreeStatus(trafficStatus.id, getActionsList)
                      }
                      className={`${deletePermission ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      src={RedCrossIcon}
                      alt="RedCrossIcon"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* <div className="py-3 bg-white h-[23%] rounded-3xl text-center text-[#2B3674]">
          <div className="flex items-center justify-center">
            <p className="p-2 text-xs">
              {t("netfree.buyerReviewNotification")}
            </p>
            <ToggleSwitch selected={true} />
          </div>
          <div className="flex items-center justify-center">
            <p className="p-2 text-xs">
              {t("netfree.buyerReviewNotification")}
            </p>
            <ToggleSwitch selected={true} />
          </div>
          <div className="flex items-center justify-center">
            <p className="p-2 text-xs">
              {t("netfree.buyerReviewNotification")}
            </p>
            <ToggleSwitch selected={true} />
          </div>
        </div> */}
      </div>

      <div className="shadow-custom rounded-2xl px-4 py-3 flex flex-col gap-3 bg-white">
        <div className="flex items-center justify-between w-full">
          <NetfreeTabs
            currentTab={tab}
            handleTabChange={handleChange}
            tabsArray={NetfreePageTabs}
          />
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <p className="text-gray-11 font-medium text-md">
                {t("netfree.searchUrl")}
              </p>
              <CustomSearchField
                variant="auth"
                extra="mb-[10px] -mt-[14px] px-3"
                id="dateCreated"
                type="text"
                placeholder={t("searchbox.placeHolder")}
                onChange={handleSiteSearch}
                name="dateCreated"
                noUnderline="true"
                borderRadius="30"
                noBgColor
              />
            </div>
            {tab === 0 && (
              <Select
                sx={{
                  width: "150px",
                  borderRadius: "10px",
                }}
                MenuProps={{
                  sx: {
                    zIndex: 9999,
                  },
                }}
                className="[&_div]:p-0.5 [&_fieldset]:border-none appearance-none border rounded outline-none w-full p-2 text-black bg-white"
                onChange={(e) => setCategoryFilter(e.target.value)}
                value={categoryFilter}
                placeholder={t("netfree.select_filter")}
              >
                <MenuItem value={"select_filter"} disabled>
                  {t("netfree.select_filter")}
                </MenuItem>
                {categoryFilters.length > 0 &&
                  categoryFilters?.map((el) => {
                    return el ? (
                      <MenuItem key={el} value={el}>
                        {t(`netfree.${el}`)}
                      </MenuItem>
                    ) : null;
                  })}
              </Select>
            )}
          </div>
        </div>

        {tab === 0 && (
          <Categories
            categoryFilter={categoryFilter}
            profileList={profilesList}
            categoriesData={categoriesData}
            handleSiteSearch={handleSiteSearch}
            searchResult={searchResult}
            handleUpdateCategory={handleUpdateCategory}
            defaultActionList={defaultActionList}
            defaultStatus={defaultStatus}
            defaultTraffic={defaultTraffic}
            updateDefaultTrafficHandler={updateDefaultTrafficHandler}
            defaultTrafficActions={defaultTrafficActions}
            trafficStatus={trafficStatus}
            clickedAction={clickedAction}
            getCategoryData={getCategoryData}
            isLoading={isLoading}
            setTrafficAction={setTrafficAction}
            enableActionUpdate={enableActionUpdate}
            setIsDefaultActionSelectOpen={setIsDefaultActionSelectOpen}
            openActionOptions={openActionOptions}
            handleClickedAction={handleClickedAction}
            editSelectedAction={editSelectedAction}
            deleteAction={deleteAction}
            searchCategories={searchCategories}
            categoriesDataCopy={categoriesDataCopy}
            actionsList={actionsList}
            currentSearchTerm={currentSearchTerm}
            setCurrentSearchTerm={setCurrentSearchTerm}
            currentActionSearchTerm={currentActionSearchTerm}
            setCurrentActionSearchTerm={setCurrentActionSearchTerm}
            writePermission={writePermission}
          />
        )}

        {tab === 1 && (
          <Websites writePermission={writePermission} updatePermission={updatePermission} deletePermission={deletePermission} currentTab={currentTab} handleTabChange={handleChange} />
        )}
      </div>

      {profilesList && activeProfile && (
        <>
          <ActionModal
            showModal={showActionModal}
            setShowModal={setShowActionModal}
            updateAction={updateAction}
            categoryId={currentSelectedCategoryId}
            setDefaultAction={setDefaultAction}
            isDefault={isDefaultActionSelectOpen}
            editActionID={editActionID}
            setEditActionId={setEditActionId}
            trafficAction={trafficAction}
            setTrafficAction={setTrafficAction}
            defaultStatus={defaultStatus}
            trafficStatus={trafficStatus}
            searchCategories={searchCategories}
            currentSearchTerm={currentSearchTerm}
            currentActionSearchTerm={currentActionSearchTerm}
          />
          <ProfileModal
            showModal={showProfileModal}
            setShowModal={() => setShowProfileModal(!showProfileModal)}
            profile={activeProfile}
            newProfile={newProfile}
            profilesList={profilesList}
            onClick={getAllProfilesListHandler}
          />
        </>
      )}
    </div>
  );
};

export default NetFree;
