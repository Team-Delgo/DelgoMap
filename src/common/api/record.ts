import axios, { AxiosResponse } from 'axios';
import { AnyAction, Dispatch } from 'redux';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

export interface MapDataType {
  data: {
    mungpleList: any[];
    normalCertList: any[];
    mungpleCertList: any[];
    exposedMungpleCertList: any[];
    exposedNormalCertList: any[];
  };
}

async function getMapData(userId: number) {
  const { data } = await axiosInstance.get<MapDataType>(`/map/${userId}`);
  return data.data;
}

function getCalendarData(
  userId: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .get(`/calendar/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function sendEmail(
  email: string,
  success: (data: AxiosResponse) => void,
  dispatch: Dispatch<AnyAction>,
) {
  axiosInstance
    .post(`/survey`, {
      email,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
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
      useErrorHandlers(dispatch, error);
    });
}

function getPhotoCount(
  userId: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .get(`/certification/count/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

async function getRecordCertificationDate(
  userId: number,
  date: string,
  success: (date: AxiosResponse) => void,
) {
  axiosInstance
    .get(`/certification/date?userId=${userId}&date=${date}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getRecordCertificationId(
  userId: number,
  certId: number,
  success: (date: AxiosResponse) => void,
) {
  axiosInstance
    .get(`/certification?userId=${userId}&certificationId=${certId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export {
  getMapData,
  getRecordCertificationDate,
  getRecordCertificationId,
  sendEmail,
  getCalendarData,
  getPhotoData,
  getPhotoCount,
};
