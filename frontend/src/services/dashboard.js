import api from "./api";

const getUserDetail = () => {
    return api.get("/api/auth/get-user/");
}

const dashboardServices = {
    getUserDetail
}
export default dashboardServices;