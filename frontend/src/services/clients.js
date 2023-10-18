import api from "./api";

const getClients = () => {
    const lang = localStorage.getItem("DEFAULT_LANGUAGE")
    return api
        .get(`/api/client/?lang=${lang}`);
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
    return api.post(`/api/client/import/`, fileData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

const exportClients = () => {
    return api.get("/api/client/export/");
}

const clientsService = {
    getClients,
    saveClient,
    updateClient,
    deleteClient,
    importClients,
    exportClients
}
export default clientsService;
