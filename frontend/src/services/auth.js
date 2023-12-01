import api from "./api";

const login = (email, password) => {
  return api
    .post('/api/auth/login/', {
      email,
      password
    })
}

const getUsers = (params) => {
  return api
    .get(`/api/auth/users/${params}`)
}

const authService = {
  login,
  getUsers
}
export default authService
