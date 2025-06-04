import api from "./api";

const getRules = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.get(
    `/api/automation-workflow/netfree-rules/?lang=${lang}&profile=${
      filterProfileID ? filterProfileID : "1"
    }`
  );
};

const createRule = (formData) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const fetchedProfile = localStorage.getItem("FILTER_PROFILE_ID");
  const profileID = fetchedProfile ? fetchedProfile : "1";
  formData.append("netfree_profile", profileID);

  return api.post(
    `/api/automation-workflow/netfree-rules/?lang=${lang}&profile=${profileID}`,
    formData
  );
};
const editRule = (formData, id) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const fetchedProfile = localStorage.getItem("FILTER_PROFILE_ID");
  const profileID = fetchedProfile ? fetchedProfile : "1";
  formData.append("netfree_profile", profileID);
  return api.patch(
    `/api/automation-workflow/netfree-rules/${id}/?lang=${lang}&profile=${profileID}`,
    formData
  );
};

const deleteRule = (ruleID) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.delete(
    `/api/automation-workflow/netfree-rules/${ruleID}/?lang=${lang}&profile=${
      filterProfileID ? filterProfileID : "1"
    }`
  );
};

const rulesServices = {
  getRules,
  createRule,
  editRule,
  deleteRule,
};
export default rulesServices;
