import api from "./api";

const getClients = (params) => {
    return api
        .get(`/api/client/${params}`);
}

const getClient = (id, params = "") => {
    return api
        .get(`/api/client/${id}/${params}`);
}

const saveClient = (clientData) => {
    return api.post(`/api/client/`, clientData);
}

const updateClient = (clientData, id) => {
    return api.put(`/api/client/${id}/`, clientData);
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
    return api.options("/api/client/filters/");
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
}
export default clientsService;
