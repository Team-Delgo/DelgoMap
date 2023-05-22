import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

function login(info: { email: string; password: string }) {
  const data = axios.post(`https://www.reward.delgo.pet/login`, {
    email: info.email,
    password: info.password,
  });
  return data;
}

async function emailAuth(email: string) {
  const data = await axiosInstance.get(`/auth/email`, {
    params: { email },
  });
  return data;
}

function changePassword(
  email: string,
  password: string,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .put(`/user/password`, {
      email,
      newPassword: password,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

export { login, emailAuth, changePassword };
