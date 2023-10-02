import api from "./api";

const getRequests = () => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE")
    return api
      .get(`/api/crm/requests/?lang=${lang}`)
  }

  const requestService = {
    getRequests
  }
  export default requestService;
