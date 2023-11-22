import api from "./api";

const getClients = (page) => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE");
    return api
        .get(`/api/client/?lang=${lang}&page=${page}`);
}

const getClient = (id) => {
    return api
        .get(`/api/client/${id}/`);
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
    // & lang=${ lang }
    return api.get(`/api/client/field/`);
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
    updateBlockField
}
export default clientsService;
