import api from "./api";

const getClients = (params) => {
    return api
        .get(`/api/client/${params}`);
}
const getClientsFormsPage = (params) => {
    return api
        .get(`/api/client/get-forms-clients/${params}`);
}

const getClient = (id, params = "") => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api
        .get(`/api/client/${id}/?lang=${lang}&${params}`);
}

const saveClient = (clientData) => {
    return api.post(`/api/client/`, clientData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

const updateClient = (clientData, id) => {
    return api.put(`/api/client/${id}/`, clientData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

const deleteClient = (id) => {
    return api.delete(`/api/client/${id}/`);
}

const importClients = (fileData) => {
    return api.post(`/api/client/import/`, fileData);
}

const exportClients = (filterId = '') => {
    return api.get(`/api/client/export/${filterId}`);
}

const getFullformData = (params = "") => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.get(`/api/client/field/?lang=${lang}${params}`);
}
const getFullformClientsPageData = (params = "") => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.get(`/api/client/client-page-field/?lang=${lang}${params}`);
}
const getFullformAutomationPageData = (params = "") => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.get(`/api/client/automation-page-field/?lang=${lang}${params}`);
}
const getFullformEmailPageData = (params = "") => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.get(`/api/client/email-page-field/?lang=${lang}${params}`);
}
const getFormDataByBlockId = (params) => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.get(`/api/client/field/?lang=${lang}&${params}`);
}

const createBlockField = (formData) => {
    return api.post("/api/client/field/", formData)
}

const deleteBlockField = (formData) => {
    return api.delete("/api/client/field/", { data: formData });
}

const updateBlockField = (formData) => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.put(`/api/client/field/?lang=${lang}`, formData);
}

const getClientFilters = () => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.get(`/api/client/filters/?lang=${lang}`);
}

const getClientFilterOptions = () => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.options(`/api/client/filters/${lang}/`);
}

const createFilter = (data) => {
    return api.post(`/api/client/filters/`, data)
}

const deleteFilter = (filterId) => {
    return api.delete(`/api/client/filters/`, { data: filterId })
}

const updateFilterGroup = (data) => {
    return api.put(`/api/client/filters/`, data)
}

const exportSampleFormat = () => {
    return api.get("/api/client/export/?sample=true");
}

const clientsService = {
    getClients,
    getClientsFormsPage,
    getClient,
    saveClient,
    updateClient,
    deleteClient,
    importClients,
    exportClients,
    getFullformData,
    getFullformClientsPageData,
    getFullformAutomationPageData,
    getFullformEmailPageData,
    getFormDataByBlockId,
    createBlockField,
    deleteBlockField,
    updateBlockField,
    getClientFilters,
    getClientFilterOptions,
    createFilter,
    deleteFilter,
    updateFilterGroup,
    exportSampleFormat
}
export default clientsService;
