import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

function login(data: { email: string; password: string }, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .post(`/login`, {
      email: data.email,
      password: data.password,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function emailAuth(email: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .get(`/auth/email`, {
      params: { email },
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function changePassword(email: string, password: string, success: (data: AxiosResponse) => void, dispatch: any) {
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
