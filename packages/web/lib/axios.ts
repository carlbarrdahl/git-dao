import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const instance = axios.create();

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

export default instance;
