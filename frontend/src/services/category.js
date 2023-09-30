import api from "./api";



const getCategories = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  return api.get(`/api/crm/category/?lang=${lang}`);
};

const searchSiteSetting = (query) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  return api.get(`/api/crm/category/?search=${query}&lang=${lang}`);
};

const getActions = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  return api.get(`/api/crm/actions/?lang=${lang}`);
};

const setDefaultAction = (data) => {
  return api.post("/api/crm/actions/", data);
};

const getDefaultAction = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
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
