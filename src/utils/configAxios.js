import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!config.headers.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      localStorage.clear();
      window.location.href !== "http://localhost:3001/login" &&
        window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
