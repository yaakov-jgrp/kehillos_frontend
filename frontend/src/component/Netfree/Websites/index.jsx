// React imports
import { useEffect, useState } from "react";

// UI Components Imports
import SearchField from "../../fields/SearchField";
import AddButtonIcon from "../../common/AddButton";
import EditButtonIcon from "../../common/EditButton";
import TooltipButtonIcon from "../../common/TootltipButton";
import ProfileModal from "../category/ProfileModal";
import Loader from "../../common/Loader";
import StatusOption from "../category/StatusOption";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";
import WebsiteModal from "./WebsiteModal";
import NetfreeTabs from "../NetfreeTabs";
import WebsiteActionModal from "./WebsiteActionModal";

// Third part Imports
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

// API services
import categoryService from "../../../services/category";

// Icon imports
import { MdExpandMore } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { HiDuplicate } from "react-icons/hi";
import BinIcon from "../../../assets/images/bin.svg";

// Utils imports
import websiteServices from "../../../services/website";

const Websites = ({ currentTab, handleTabChange }) => {
  const { t, i18n } = useTranslation();
  const defaultLanguageValue = localStorage.getItem("DEFAULT_LANGUAGE");
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");

  const [isLoading, setIsLoading] = useState(false);
  const [domainsData, setDomainsData] = useState([]);
  const [domainsDataCopy, setDomainsDataCopy] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [editActionID, setEditActionId] = useState(null);
  const [clickedAction, setClickedAction] = useState(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [siteSearch, setSiteSearch] = useState("");
  const [profilesList, setProfilesList] = useState(null);
  const [profileActiveIndex, setProfileActiveIndex] = useState(0);
  const [activeProfile, setActiveprofile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [newProfile, setNewProfile] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [domain, setDomain] = useState(null);
  const [currentDomain, setCurrentDomain] = useState(null);
  const [editDomain, setEditDomain] = useState(null);

  const setResponseDataToState = (res) => {
    const response = res.data.data.map((el) => {
      el.isActionUpdateEnabled = false;
      el.actions = el.actions.map((item) => {
        return { isClicked: false, isActionEditOn: false, ...item };
      });
      return el;
    });
    setDomainsData(response);
    setDomainsDataCopy(response);
    if (siteSearch) {
      searchWebsites(siteSearch, response);
    } else {
      searchWebsites(currentSearchTerm, response);
    }
  };

  const actionsHandler = async (data, id) => {
    try {
      const res = await websiteServices.websiteActions(data, id);
      getDomainsData();
    } catch (error) {
      console.log(error);
    }
  };

  const getDomainsData = async () => {
    setIsLoading(true);
    const response = await websiteServices.getDomains();
    setResponseDataToState(response);
    setIsLoading(false);
  };

  const enableActionUpdate = (element) => {
    if (element) {
      setCurrentDomain(element);
    }
    setShowActionModal(true);
  };

  const deleteAction = (domainId, actionToRemove) => {
    setIsLoading(true);
    actionsHandler({ id: domainId, to_remove: actionToRemove }, null);
    setIsLoading(false);
  };

  // update/edit action value
  const editAction = (domainId, currentActions, actionToRemove, newValue) => {
    setIsLoading(true);
    actionsHandler({ id: domainId, to_add: newValue }, null);
    setIsLoading(false);
  };

  //make current action editable
  const editSelectedAction = (domain, action) => {
    setCurrentDomain(domain);
    setEditActionId(action.id);
    setShowActionModal(true);
  };

  const searchWebsites = (searchTerm, response, type) => {
    setCurrentSearchTerm(searchTerm);
    if (siteSearch) {
      setDomainsData(response);
    } else if (currentSearchTerm) {
      let filteredData = [];
      if (type === "domain" || type === "note") {
        filteredData = response?.filter((el) =>
          el[type].toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        filteredData = response?.filter(
          (el) =>
            el.actions?.filter((action) =>
              action.label.toLowerCase().includes(searchTerm.toLowerCase())
            ).length > 0
        );
      }
      if (searchTerm === "") {
        filteredData = response;
      }
      setDomainsData(filteredData);
    } else {
      setDomainsData(response);
    }
  };

  const handleClickedAction = (id) => {
    if (clickedAction && clickedAction === id) {
      setClickedAction(null);
    } else {
      setClickedAction(id);
    }
  };

  const openActionOptions = (categoyIndex, action) => {
    let updatedCategoryData = JSON.parse(JSON.stringify(domainsData));
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

    setDomainsData(updatedCategoryData);
  };

  const getAllProfilesListHandler = async () => {
    const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
    if (!filterProfileID) {
      localStorage.setItem("FILTER_PROFILE_ID", 1);
    }
    const profilesListData = await categoryService.getProfilesList();
    const defaultProfile = profilesListData.data.data.filter(
      (profile) => profile.is_default
    );
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
    getDomainsData();
    getActionsList();
    getDefaultTraffic();
    getDefaultTrafficActions();
  };

  const deleteDomain = async (id) => {
    try {
      const res = await websiteServices.deleteDomain(id);
      if (res.status === 204) {
        setDomain(null);
        getDomainsData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProfilesListHandler();
    getDomainsData();
  }, [defaultLanguageValue]);

  const ActionSelectBox = ({
    options,
    domainName,
    domainId,
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
                  domainId,
                  currentActions,
                  previousValue,
                  e.target.value
                )
              : actionsHandler(
                  { id: domainId, to_add: Number(e.target.value) },
                  null
                )
          }
          placeholder="Select Action"
          value={"selectAction"}
          className="bg-white border-[1px] py-1 px-2 outline-none rounded-md"
          onBlur={() =>
            editSelectedAction(domainId, { label: "close edit options" })
          }
        >
          <option value={"selectAction"} disabled>
            Select Action
          </option>
          {options?.map((el) => {
            return el ? (
              <option key={domainName + el.id} value={el.id}>
                {el.label}
              </option>
            ) : null;
          })}
        </select>
      </div>
    );
  };

  return (
    <div className="md:h-full w-full flex-col-reverse md:flex-row flex gap-4">
      {profilesList && activeProfile && (
        <>
          <WebsiteActionModal
            showModal={showActionModal}
            setShowModal={setShowActionModal}
            actionHandler={actionsHandler}
            currentData={currentDomain}
            editActionID={editActionID}
            setEditActionId={setEditActionId}
          />
          <ProfileModal
            showModal={showProfileModal}
            setShowModal={() => setShowProfileModal(!showProfileModal)}
            profile={activeProfile}
            newProfile={newProfile}
            profilesList={profilesList}
            onClick={getAllProfilesListHandler}
          />
          {showWebsiteModal && (
            <WebsiteModal
              showModal={showWebsiteModal}
              editDomain={editDomain}
              setEditDomain={setEditDomain}
              setShowModal={() => setShowWebsiteModal(!showWebsiteModal)}
              onClick={getDomainsData}
            />
          )}
        </>
      )}

      <div className="bg-white rounded-3xl overflow-x-auto relative w-full">
        <div className="flex items-center justify-end w-full px-5">
          <button
            className={`w-fit mb-2 ml-auto rounded-lg py-2 px-4 text-[12px] font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 text-white dark:hover:bg-brand-300 dark:active:bg-brand-200`}
            onClick={() => {
              setEditDomain(null);
              setShowWebsiteModal(!showWebsiteModal);
            }}
          >
            {t("websites.addDomain")}
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto mb-12 w-full h-[30rem]">
          <table className="!table text-[12px] overflow-y-auto w-full">
            <thead className="sticky top-0 z-10 bg-[#F9FBFC]">
              <div className="w-full h-[0.5px] bg-[#E3E5E6] absolute top-9"></div>
              <tr className=" pr-3 rounded-lg mb-5">
                <th className="px-1 w-[15rem] pl-2 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-xl" : "text-sm"
                    }`}
                  >
                    {t("websites.domain")}
                  </p>
                  <SearchField
                    variant="auth"
                    type="text"
                    placeholder={t("searchbox.placeHolder")}
                    onChange={(e) =>
                      searchWebsites(e.target.value, domainsDataCopy, "domain")
                    }
                    name="domain"
                  />
                </th>
                <th className="pl-5 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-xl" : "text-sm"
                    }`}
                  >
                    {t("netfree.note")}
                  </p>
                  <SearchField
                    variant="auth"
                    type="text"
                    placeholder={t("searchbox.placeHolder")}
                    onChange={(e) =>
                      searchWebsites(e.target.value, domainsDataCopy, "note")
                    }
                    name="note"
                  />
                </th>
                <th className="pl-5 pt-2 pb-4">
                  <p
                    className={`text-start text-gray-11 font-medium ${
                      lang === "he" ? "text-xl" : "text-sm"
                    }`}
                  >
                    {t("netfree.actions")}
                  </p>
                  <SearchField
                    variant="auth"
                    type="text"
                    placeholder={t("searchbox.placeHolder")}
                    onChange={(e) =>
                      searchWebsites(e.target.value, domainsDataCopy, "actions")
                    }
                    name="actions"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="pt-5">
              {domainsData.map((el, currentIndex) => {
                return (
                  <tr
                    className="h-[20px] border-t bottom-b border-sky-500 w-[100%]"
                    key={el.id}
                  >
                    <td className="py-5">
                      <div className="flex justify-between">
                        <p className="font-normal text-gray-11 break-words w-[18rem]">
                          {el.domain}
                        </p>
                        <div className="flex items-center justify-center">
                          <EditButtonIcon
                            extra="mr-2 justify-self-end"
                            onClick={() => {
                              setEditDomain(el);
                              setShowWebsiteModal(true);
                            }}
                          />
                          <img
                            src={BinIcon}
                            alt="BinIcon"
                            onClick={() => {
                              setDomain(el);
                              setConfirmationModal(!confirmationModal);
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 min-w-[16rem] max-w-[24rem]">
                      {el.note}
                    </td>
                    <td className="px-5 flex gap-2 py-4">
                      {el.actions.map((action, index) => {
                        return action.label.length ? (
                          action.isActionEditOn ? (
                            <ActionSelectBox
                              key={action + index}
                              options={actionsList.map((item) =>
                                !el.actions.some(
                                  (el) => el.label === item.label
                                )
                                  ? item
                                  : null
                              )}
                              domainName={el.domain}
                              domainId={el.id}
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
                              className="px-3 relative py-1 bg-[#F2F8FB] text-gray-10 font-medium rounded-full flex gap-2 whitespace-nowrap"
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
                                      deleteAction(el.id, action.id)
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
                          getData={getDomainsData}
                          dataValue={el}
                          deleteStatusFn={(statusId) =>
                            websiteServices.deleteWebsiteStatus(statusId)
                          }
                        />
                      )}
                      {
                        <AddButtonIcon
                          extra={""}
                          onClick={() => {
                            enableActionUpdate(el);
                          }}
                        />
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {confirmationModal && domain && (
        <DeleteConfirmationModal
          showModal={confirmationModal}
          setShowModal={setConfirmationModal}
          onClick={() => deleteDomain(domain.id)}
        />
      )}
    </div>
  );
};

export default Websites;
