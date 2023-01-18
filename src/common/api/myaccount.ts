import axios, { AxiosError, AxiosResponse } from 'axios';
import { useErrorHandlers } from './useErrorHandlers';
// import axiosInstance from './interceptors';

function changePetInfo(
  data: { email: string; name: string; birthday: string | undefined; breed: string },
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  const { email, name, birthday, breed } = data;
  axios
    .put(`${process.env.REACT_APP_API_URL}/account/pet`, {
      email,
      name,
      birthday,
      breed,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function changePassword(email: string, password: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .put(`${process.env.REACT_APP_API_URL}/account/password`, {
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

function changeGeoCode(email: string, geoCode: string, pGeoCode: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .put(`${process.env.REACT_APP_API_URL}/account/user`, {
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

function changeName(email: string, name: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .put(`${process.env.REACT_APP_API_URL}/account/user`, {
      email,
      name,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function setPushNotification(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .put(`${process.env.REACT_APP_API_URL}/account/notify/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}


function logOut(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .post(`${process.env.REACT_APP_API_URL}/account/logout/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

async function getMyInfo(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axios
    .post(`${process.env.REACT_APP_API_URL}/user?userId=${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

async function getMyPoint(userId: number) {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/account/point?userId=${userId}`);
  return data;
}


export { changePetInfo, changePassword, changeGeoCode, changeName, setPushNotification, logOut, getMyInfo, getMyPoint };
