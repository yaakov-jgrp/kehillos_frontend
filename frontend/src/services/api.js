import axios from 'axios'
import.meta.env.VITE_API_URL
import { ACCESS_TOKEN_KEY } from '../constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });


  const requestSuccessInterceptor =  (config) => {
    const authToken =  localStorage.getItem(ACCESS_TOKEN_KEY);
    if (authToken) {
      config.headers.Authorization = "Bearer " + authToken;
    }

    return config;
  };

  api.interceptors.request.use(requestSuccessInterceptor);

  axios.interceptors.response.use( (res) => {
    return res;
  }, async (err) =>  {
    if (err.response.status === 401) {
      const originalRequest = err.config;
      if (err.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem(REFRESH_TOKEN_KEY);
        return api(originalRequest);
      }
      localStorage.clear();
      window.location = '/signin'
    }
    return Promise.reject(err)
  })

  export default api
