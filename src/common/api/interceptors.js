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
      const accessToken = response.headers.authorization_access;
      originalRequest.headers.authorization_access = `Bearer ${accessToken}`;

      return axios(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
