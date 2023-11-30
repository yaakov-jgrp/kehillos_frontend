import api from "./api";

const getClients = (params) => {
    return api
        .get(`/api/client/${params}`);
}

const getClient = (id, params = "") => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api
        .get(`/api/client/${id}/?lang=${lang}${params}`);
}

const saveClient = (clientData) => {
    return api.post(`/api/client/`, clientData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

const updateClient = (clientData, id) => {
    return api.post(`/api/client/${id}/`, clientData, {
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

const exportClients = () => {
    return api.get("/api/client/export/");
}

const getFullformData = () => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api.get(`/api/client/field/?lang=${lang}`);
}

const createBlockField = (formData) => {
    return api.post("/api/client/field/", formData)
}

const deleteBlockField = (formData) => {
    return api.delete("/api/client/field/", { data: formData });
}

const updateBlockField = (formData) => {
    return api.put("/api/client/field/", formData);
}

const getClientFilters = () => {
    return api.get("/api/client/filters/");
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

const clientsService = {
    getClients,
    getClient,
    saveClient,
    updateClient,
    deleteClient,
    importClients,
    exportClients,
    getFullformData,
    createBlockField,
    deleteBlockField,
    updateBlockField,
    getClientFilters,
    getClientFilterOptions,
    createFilter,
    deleteFilter,
    updateFilterGroup
}
export default clientsService;
