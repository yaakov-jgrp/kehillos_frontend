import api from "./api";

const getRequests = (params) => {
  return api
    .get(`/api/crm/requests/${params}`)
}

const requestService = {
  getRequests
}
export default requestService;
