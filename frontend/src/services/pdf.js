import api from "./api";

const getTemplates = () => {
  return api
    .get('/api/crm/pdf-template/')
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
}
export default pdfService;
