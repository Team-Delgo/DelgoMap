import { AxiosResponse } from 'axios';
import { AnyAction, Dispatch } from 'redux';
import { Cert, Mungple } from 'page/map/index.types';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';
import { APIResponse } from '../types/api';

export interface MapData {
  mungpleList: Mungple[];
  normalCertList: any[];
  mungpleCertList: any[];
  exposedMungpleCertList: any[];
  exposedNormalCertList: any[];
}

async function getMapData(userId: number) {
  const { data } = await axiosInstance.get<APIResponse<MapData>>(`/map/${userId}`);
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

interface Photos {
  number: number;
  last: boolean;
  content: Cert[];
  totalCount: number;
}

async function getMyPhotoData(
  userId: number,
  categoryCode: string,
  currentPage: number,
  pageSize: number,
  isDesc: boolean,
) {
  const sortOrder = isDesc ? 'desc' : 'asc'; // isDesc 값에 따라 정렬 순서를 결정합니다.
  const response = await axiosInstance.get<APIResponse<Photos>>(
    `/certification/my?categoryCode=${categoryCode}&userId=${userId}&page=${currentPage}&size=${pageSize}&sort=registDt,${sortOrder}`,
  );
  return response.data.data;
}
async function getOtherPhotoData(
  userId: number,
  categoryCode: string,
  currentPage: number,
  pageSize: number,
  isDesc: boolean,
) {
  const sortOrder = isDesc ? 'desc' : 'asc'; // isDesc 값에 따라 정렬 순서를 결정합니다.
  const response = await axiosInstance.get<APIResponse<Photos>>(
    `/certification/other?categoryCode=${categoryCode}&userId=${userId}&page=${currentPage}&size=${pageSize}&sort=registDt,${sortOrder}`,
  );
  return response.data.data;
}

async function getPhotoCount(userId: number) {
  const response = await axiosInstance.get<AxiosResponse<number>>(
    `/certification/count/${userId}`,
  );
  return response.data.data;
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
    .get(`/certification/id?userId=${userId}&certificationId=${certId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export type SearchedUser = {
  userId: number;
  nickname: string;
  profile: string;
  petId: number;
  petName: string;
  breed: string;
  breedName: string;
  yearOfPetAge: number;
  monthOfPetAge: number;
};
type SearchUserResponse = {
  size: number;
  number: number;
  last: boolean;
  content: SearchedUser[];
};

async function searchUserList(searchWord: string, page: number, size: number) {
  return (
    await axiosInstance.get<APIResponse<SearchUserResponse>>(
      `/user/search?searchWord=${searchWord}&page=${page}&size=${size}`,
    )
  ).data.data;
}

export {
  getMapData,
  getRecordCertificationDate,
  getRecordCertificationId,
  sendEmail,
  getCalendarData,
  getMyPhotoData,
  getOtherPhotoData,
  getPhotoCount,
  searchUserList,
};
