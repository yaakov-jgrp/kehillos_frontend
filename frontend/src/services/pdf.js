import api from "./api";

const getTemplates = () => {
  return api
    .get('/api/crm/pdf-template/')
}

const getFullformEmailPageData = (params) => {
  const lang = localStorage.getItem("DEFAULT_LANGUAGE");
  return api.get(`/api/crm/pdf-template/?lang=${lang}${params}`);
}

// const getTemplatesnetfree = () => {
//   return api
//     .get('/api/crm/netfree-template/')
// }

const addNewTemplate = (data) => {
  return api
    .post('/api/crm/pdf-template/', data)
}

const updateTemplate = (data) => {
  return api
    .patch('/api/crm/pdf-template/', data)
}

const getSingleTemplate = (id) => {
  return api
    .get(`/api/crm/pdf-template/?id=${id}`)
}

const deleteTemplate = (id) => {
  return api
    .delete(`/api/crm/pdf-template/?id=${id}`)
}

const exportPdfFile = (data) => {
  return api
    .post(`/api/crm/export-pdf/${data.clientId}/`, data, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
        'Content-Type': 'application/json'
      }
    })
}

const duplicateTemplate = (templateId) => {
  return api.post('/api/crm/pdf-template-clone/', { id: templateId });
}

// const getTemplatingTexts = (params) => {
//   return api.get(`/api/crm/hoursvalues/${params}`);
// }

// const createTemplatingText = (data) => {
//   return api.post("/api/crm/hoursvalues/", data);
// }

// const updateTemplatingText = (data, id) => {
//   return api.put(`/api/crm/hoursvalues/${id}/`, data);
// }

// const deleteTemplatingText = (id) => {
//   return api.delete(`/api/crm/hoursvalues/${id}/`);
// }

const uploadPdf = (clientId, data) => {
  return api.post(`/api/crm/client-pdfs/${clientId}/`, data, {
    headers: {
      'Content-Type': 'application/pdf'
    }
  });
};

const getClientPdfs = (clientId) => {
  return api.get(`/api/crm/client-pdfs/${clientId}/`);
};

const downloadPdf = (clientId, pdfId) => {
  return api.get(`/api/crm/client-pdfs/${clientId}/${pdfId}/`, {
    responseType: 'blob',
  });
};

const pdfService = {
  getTemplates,
  // getTemplatesnetfree,
  addNewTemplate,
  updateTemplate,
  getSingleTemplate,
  deleteTemplate,
  duplicateTemplate,
  // getTemplatingTexts,
  // createTemplatingText,
  // updateTemplatingText,
  // deleteTemplatingText,
  exportPdfFile,
  uploadPdf,
  getClientPdfs,
  downloadPdf,
  getFullformEmailPageData,
}
export default pdfService;
