import api from "./api";

const getRequests = (params) => {
  return api
    .get(`/api/crm/requests/${params}`)
}

const getRequestStatuses = (params) => {
  return api.get(`/api/crm/requests-status/${params}`)
}

const updateRequestStatus = (data) => {
  return api.put(`/api/crm/requests/`, data)
}

const requestService = {
  getRequests,
  getRequestStatuses,
  updateRequestStatus
}
export default requestService;
