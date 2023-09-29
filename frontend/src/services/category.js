import api from "./api";

const lang = localStorage.getItem("DEFAULT_LANGUAGE");

const getCategories = () => {
  return api.get(`/api/crm/category/?lang=${lang}`);
};

const searchSiteSetting = (query) => {
  return api.get(`/api/crm/category/?search=${query}`);
};

const getActions = () => {
  return api.get(`/api/crm/actions/?lang=${lang}`);
};

const setDefaultAction = (data) => {
  return api.post("/api/crm/actions/", data);
};

const getDefaultAction = () => {
  return api.get(`/api/crm/actions/?get_default=true&lang=${lang}`);
};

const updateCategories = () => {
  return api.post("/api/crm/category/");
};

const updateActionInCategory = (data) => {
  return api.put("/api/crm/category/", data);
};

const categoryService = {
  getCategories,
  getActions,
  setDefaultAction,
  getDefaultAction,
  updateCategories,
  updateActionInCategory,
  searchSiteSetting,
};
export default categoryService;
