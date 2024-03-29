import { AxiosResponse } from 'axios';
import { AnyAction, Dispatch } from 'redux';
import { Mungple } from '../types/map';
import { Cert } from 'page/map/index.types';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';
import { APIResponse } from '../types/api';

export type MapDataResponseDTO = {
  mungpleList: (Mungple & { photoUrl: string })[];
  normalCertList: any[];
  mungpleCertList: any[];
  exposedMungpleCertList: any[];
  exposedNormalCertList: any[];
};

async function getMapData(userId: number) {
  const { data } = await axiosInstance.get<APIResponse<MapDataResponseDTO>>(
    `/map/${userId}`,
  );
  return data.data;
}

export type SortOption = 'NEWEST' | 'OLDEST' | 'DISTANCE' | 'CERT' | 'BOOKMARK';
export type MungpleMap = Pick<
  Mungple,
  | 'mungpleId'
  | 'categoryCode'
  | 'placeName'
  | 'placeNameEn'
  | 'latitude'
  | 'longitude'
  | 'address'
  | 'detailUrl'
> & {
  photoUrl: string;
  certCount: number;
  bookmarkCount: number;
  isBookmarked: boolean;
};
export type MungpleResponseDTO = MungpleMap[];

export async function getMungple(userId: number) {
  return (
    await axiosInstance.get<APIResponse<MungpleResponseDTO>>(
      `/mungple/category?userId=${userId}&categoryCode=CA0000&sort=NOT`,
    )
  ).data.data;
}

export async function getCerts(userId: number) {
  return (
    await axiosInstance.get<APIResponse<any>>(
      `/certification/my?userId=${userId}&categoryCode=CA0000&page=0&size=100`,
    )
  ).data.data;
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
  viewCount: number;
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
  console.log(response.data.data);
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
