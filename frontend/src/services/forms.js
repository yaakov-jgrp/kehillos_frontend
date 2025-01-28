import { formatDate } from "../utils/helpers";
import api from "./api";

const createNewForm = (data) => {
  return api.post(`/api/forms/create-form/`, data);
};

const getAllForms = (params) => {
  return api.get(`/api/forms/get-forms/${params}`);
};
const getAllFormsFormsPage = (params) => {
  return api.get(`/api/forms/get-forms-formspage/${params}`);
};
const getAllFormsPage = (params) => {
  return api.get(`/api/client/get-forms-formspage/${params}`);
};

const deleteForm = (id) => {
  return api.delete(`/api/forms/delete-form/${id}`);
};

const createNewCondition = (data) => {
  return api.post(`/api/forms/add-condition/`, data);
};

const deleteCondition = (id) => {
  return api.delete(`/api/forms/delete-condition/${id}`);
};

const createNewBlock = (data) => {
  return api.post(`/api/forms/add-block/`, data);
};

const deleteBlock = (id) => {
  return api.delete(`/api/forms/delete-block/${id}`);
};

const createNewField = (data) => {
  return api.post(`/api/forms/add-field/`, data);
};

const deleteField = (id) => {
  return api.delete(`/api/forms/delete-field/${id}`);
};

const updateForm = (id, data) => {
  return api.put(`/api/forms/update-form/${id}`, data);
};

const createNewClientForm = (data) => {
  return api.post(`/api/forms/create-client-form/`, data);
};

const getAllClientsForms = (params) => {
  return api.get(`/api/forms/client-forms/${params}`);
};

const deleteClientForm = (id) => {
  return api.delete(`/api/forms/delete-client-form/${id}`);
};

const getSingleClientForms = (clientId) => {
  return api.get(`/api/forms/client-forms/${clientId}`);
};
const getSingleClientPage = (clientId) => {
  return api.get(`/api/client/client-forms/${clientId}`);
};

const getSingleClientFormDetails = (formId) => {
  return api.get(`/api/forms/client-form-details/${formId}`);
};
const getSingleClientFormDetailsPage = (formId) => {
  return api.get(`/api/client/client-form-details/${formId}`);
};

const createNewClientFormVersion = (data) => {
  return api.post(`/api/forms/create-client-form-version/`, data);
};

const formService = {
  createNewForm,
  getAllFormsFormsPage,
  getAllFormsPage,
  getAllForms,
  deleteForm,
  createNewCondition,
  createNewBlock,
  deleteBlock,
  createNewField,
  deleteField,
  deleteCondition,
  updateForm,
  createNewClientForm,
  deleteClientForm,
  getAllClientsForms,
  getSingleClientForms,
  getSingleClientPage,
  getSingleClientFormDetails,
  getSingleClientFormDetailsPage,
  createNewClientFormVersion,
};

export default formService;
