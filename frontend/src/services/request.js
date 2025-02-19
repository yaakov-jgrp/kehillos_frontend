import api from "./api";

const getRequests = (params) => {
  return api.get(`/api/crm/requests/${params}`);
};

const fetchRequestScreenshot = (data) => {
  return api.post("/api/crm/requests/screenshot/", data);
};

const getRequestStatuses = (params) => {
  return api.get(`/api/crm/requests-status/${params}`);
};
const getRequestStatusesNetfree = (params) => {
  return api.get(`/api/crm/netfree-requests-status/${params}`);
};

const updateRequestStatus = (data) => {
  return api.put(`/api/crm/requests/`, data);
};

const createRequestStatus = (data) => {
  return api.post("/api/crm/requests-status/", data);
};

const updateStatus = (id, data) => {
  return api.put(`/api/crm/requests-status/${id}/`, data);
};

const deleteStatus = (id) => {
  return api.delete(`/api/crm/requests-status/${id}/`);
};

const deleteCategoryStatus = (id) => {
  return api.delete(`/api/crm/category-request-status/${id}/`);
};

const addRequestActions = (data) => {
  return api.put(`/api/crm/requests-manual-action/`, data);
};

const fetchRequestDetails = (id) => {
  return api.get(`/api/crm/requests/${id}/`);
};

const fetchManualActions = (id, params) => {
  return api.get(
    `/api/crm/requests-manual-action/?email_request_id=${id}${params}`
  );
};

const requestService = {
  getRequests,
  getRequestStatuses,
  getRequestStatusesNetfree,
  updateRequestStatus,
  createRequestStatus,
  fetchRequestScreenshot,
  deleteCategoryStatus,
  updateStatus,
  deleteStatus,
  deleteCategoryStatus,
  addRequestActions,
  fetchRequestDetails,
  fetchManualActions,
};
export default requestService;
