import api from "./api";

const getCategories = () => {
  return api
    .get('/api/crm/category/')
}

const searchSiteSetting = (query) => {
  return api
    .get(`/api/crm/category/?search=${query}`);
}

const getActions = () => {
  return api
    .get('/api/crm/actions/')
}

const setDefaultAction = (data) => {
  return api
    .post('/api/crm/actions/', data);
}

const getDefaultAction = () => {
  return api
    .get('/api/crm/actions/?default=1');
}

const updateCategories = () => {
  return api
    .post('/api/crm/category/')
}

const updateActionInCategory = (data) => {
  return api
    .put('/api/crm/category/', data)
}

const categoryService = {
  getCategories,
  getActions,
  setDefaultAction,
  getDefaultAction,
  updateCategories,
  updateActionInCategory,
  searchSiteSetting
}
  export default categoryService;
