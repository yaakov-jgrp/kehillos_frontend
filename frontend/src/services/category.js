import api from "./api";

const getCategories = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.get(`/api/crm/category/?lang=${lang}&profile=${filterProfileID ? filterProfileID : "1"}`);
};

const searchSiteSetting = (query) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.get(`/api/crm/category/?search=${query}&lang=${lang}&profile=${filterProfileID ? filterProfileID : "1"}`);
};

const getActions = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.get(`/api/crm/actions/?lang=${lang}&profile=${filterProfileID ? filterProfileID : "1"}`);
};

const setDefaultAction = (data) => {
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.post(`/api/crm/actions/?profile=${filterProfileID ? filterProfileID : "1"}`, data);
};

const getDefaultAction = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.get(`/api/crm/actions/?get_default=true&lang=${lang}&profile=${filterProfileID ? filterProfileID : "1"}`);
};

const getDefaultTraffic = () => {
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.get(`/api/crm/netfree-traffic/?default=true&profile=${filterProfileID ? filterProfileID : "1"}`);
};

const updateNetfreeTraffic = (data) => {
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  return api.post(`/api/crm/netfree-traffic/?profile=${filterProfileID ? filterProfileID : "1"}`, data);
};

const updateCategories = () => {
  return api.post("/api/crm/category/");
};

const updateActionInCategory = (data, id) => {
  const filterProfileID = localStorage.getItem("FILTER_PROFILE_ID");
  if (id) {
    return api.put(`/api/crm/category/?status=update&id=${id}&profile=${filterProfileID ? filterProfileID : "1"}`, data);
  } else {
    return api.put(`/api/crm/category/?profile=${filterProfileID ? filterProfileID : "1"}`, data);
  }
};

const getProfilesList = (params) => {
  return api.get(`/api/crm/netfree-categories-profile/${params}`)
}

const createFilterProfile = (data) => {
  return api.post(`/api/crm/netfree-categories-profile/`, data)
}

const updateFilterProfile = (data, params) => {
  return api.put(`/api/crm/netfree-categories-profile/${params}`, data)
}

const categoryService = {
  getCategories,
  getActions,
  setDefaultAction,
  getDefaultAction,
  getDefaultTraffic,
  updateCategories,
  updateNetfreeTraffic,
  updateActionInCategory,
  searchSiteSetting,
  getProfilesList,
  createFilterProfile,
  updateFilterProfile
};
export default categoryService;
