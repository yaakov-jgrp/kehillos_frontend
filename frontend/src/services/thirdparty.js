import api from "./api";

const getWhatsappStatus = (phone) => {
  return api.get(`/api/crm/whatsapp-check/${phone}`);
};

const thirdpartyService = {
  getWhatsappStatus,
};

export default thirdpartyService;
