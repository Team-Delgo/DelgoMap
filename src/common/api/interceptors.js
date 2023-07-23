import axios from 'axios';

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
    if (status === 403) {
      const refreshToken = localStorage.getItem('refreshToken') || '';

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/token/reissue`, {
        headers: {
          authorization_refresh: refreshToken,
        },
      });

      console.log('token reissue response', response);

      if (response.data.code === 303) {
        throw new Error('token exprired');
      }

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
