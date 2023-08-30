import axios from 'axios';
import { tokenRefresh } from './login';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 재요청 대기열
type PromiseResolveReject = {
  resolve: (value?: string | PromiseLike<string> | undefined) => void;
  reject: (reason?: any) => void;
};
let failedQueue: PromiseResolveReject[] = [];

// 대기 중인 요청을 처리하는 함수
const processQueue = (error: any, token: string | undefined = undefined): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;
    if (status === 401 && !originalRequest._retry) {

      // 이미 토큰 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.authorization_access = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        tokenRefresh()
          .then((token) => {
            originalRequest.headers.authorization_access = `Bearer ${token}`;
            processQueue(null, token);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, undefined);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
