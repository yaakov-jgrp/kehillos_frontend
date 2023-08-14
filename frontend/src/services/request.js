import api from "./api";

const getRequests = () => {
    return api
      .get('/api/crm/requests/')
  }

  const requestService = {
    getRequests
  }
  export default requestService;
