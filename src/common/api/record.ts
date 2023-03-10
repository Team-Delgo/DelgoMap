import axios, { AxiosResponse } from 'axios';
import { AnyAction, Dispatch } from 'redux';
import axiosInstance from './interceptors';

function getMapData(userId: number, success: (data: AxiosResponse) => void, dispatch: Dispatch<AnyAction>) {
  axiosInstance
    .get(`/map/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getCalendarData(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .get(`/calendar/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function sendEmail(email: string, success: (data: AxiosResponse) => void, dispatch: Dispatch<AnyAction>) {
  axiosInstance
    .post(`/survey`, {
      email,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getPhotoData(
  userId: number,
  categoryCode: string,
  currentPage: number,
  pageSize: number,
  isDesc: boolean,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .get(
      `/certification/category?categoryCode=${categoryCode}&userId=${userId}&currentPage=${currentPage}&pageSize=${pageSize}&isDesc=${isDesc}`,
    )
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getPhotoCount(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .get(`/certification/count/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export { getMapData, sendEmail, getCalendarData, getPhotoData, getPhotoCount };
