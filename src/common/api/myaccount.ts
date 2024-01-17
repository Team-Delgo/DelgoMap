import { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

function changePetInfo(
  data: { email: string; name: string; birthday: string | undefined; breed: string },
  success: (response: AxiosResponse) => void,
  dispatch: any,
) {
  const { email, name, birthday, breed } = data;
  axiosInstance
    .put(`/account/pet`, {
      email,
      name,
      birthday,
      breed,
    })
    .then((response) => {
      success(response);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function changePassword(
  email: string,
  password: string,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .put(`/account/password`, {
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

function changeUserInfo(
  userId: number,
  name: string,
  geoCode: string,
  pGeoCode: string,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .put(`/account/user`, {
      userId,
      name,
      geoCode,
      pGeoCode,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function setPushNotification(
  userId: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .put(`/account/notify/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function logOut(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .post(`account/logout/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

async function getAccountInfo(userId: number) {
  const { data } = await axiosInstance.get(`/account?userId=${userId}`);
  return data.data;
}

export {
  changePetInfo,
  changePassword,
  changeUserInfo,
  setPushNotification,
  logOut,
  getAccountInfo,
};
