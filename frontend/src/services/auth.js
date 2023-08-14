import api from "./api";

const login = (email, password) => {
    return api
      .post('/api/auth/login/', {
        email,
        password
      })
  }




  const authService = {
    login
  }
  export default authService
