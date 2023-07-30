import axios from 'axios';
import { tokenRefresh } from './login';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken') || '';
    if (config.headers !== undefined && accessToken !== '') {
      config.headers.authorization_access = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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
      tokenRefresh();

      const originalRequest = config;
      const newAccessToken = response.headers.authorization_access;
      const newRefreshToken = response.headers.authorization_refresh;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      originalRequest.headers.authorization_access = newAccessToken;

      return axios(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
