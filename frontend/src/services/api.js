// Third part Imports
import axios from 'axios';

// Utils imports
import { ACCESS_TOKEN_KEY } from '../constants';
import { errorsToastHandler } from '../lib/CommonFunctions';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});


const requestSuccessInterceptor = (config) => {
  const authToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (authToken) {
    config.headers.Authorization = "Bearer " + authToken;
  }

  return config;
};

api.interceptors.request.use(requestSuccessInterceptor);

api.interceptors.response.use((res) => {
  return res;
}, (err) => {
  if (err.response.status === 401) {
    // const originalRequest = err.config;
    // if (err.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
    //   return api(originalRequest);
    // }
    localStorage.clear();
    if (!window.location.pathname.includes("/signin")) {
      window.location = '/signin'
    }
  }
  if (Object.keys(err?.response?.data?.errors).length > 0) {
    errorsToastHandler(err.response.data.errors);
  }
  return Promise.reject(err)
})

export default api
