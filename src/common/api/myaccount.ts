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

function changeGeoCode(
  email: string,
  geoCode: string,
  pGeoCode: string,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .put(`/account/user`, {
      email,
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

function changeName(
  userId: number,
  name: string,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .put(`/account/user`, {
      userId,
      name,
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

async function getMyInfo(
  userId: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .get(`/account?userId=${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

async function getMyPoint(userId: number) {
  const { data } = await axiosInstance.get(`/account/point?userId=${userId}`);
  return data;
}

async function getMyProfileInfo(userId: number) {
  const { data } = await axiosInstance.get(`/account?userId=${userId}`);
  console.log(data);
  return data;
}
async function getOtherProfileInfo(userId: number) {
  const { data } = await axiosInstance.get(`/user/other?userId=${userId}`);
  console.log(data);
  return data;
}
export {
  changePetInfo,
  changePassword,
  getOtherProfileInfo,
  changeGeoCode,
  changeName,
  setPushNotification,
  logOut,
  getMyInfo,
  getMyPoint,
  getMyProfileInfo,
};
