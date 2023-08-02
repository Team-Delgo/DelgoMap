import axios from 'axios';
import { tokenRefresh } from './login';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    if (status === 401) {
      const response = await tokenRefresh();

      const originalRequest = config;
      const newAccessToken = response.headers.authorization_access;

      originalRequest.headers.authorization_access = newAccessToken;

      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
