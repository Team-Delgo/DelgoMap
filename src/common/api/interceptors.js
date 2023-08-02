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
    if(config.sent || status !== 401) return Promise.reject(err);
    if (status === 401) {
      config.sent = true;
      const response = await tokenRefresh();
      if(response){
        const originalRequest = config;
        const newAccessToken = response.headers.authorization_access;
        console.log(newAccessToken);
        originalRequest.headers.authorization_access = newAccessToken;
  
        return axiosInstance(originalRequest);
      }
    }
  },
);

export default axiosInstance;