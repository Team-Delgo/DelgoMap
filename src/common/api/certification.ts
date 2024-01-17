import axiosInstance from './interceptors';
import { CategoryCode, Cert } from '../../../src/page/map/index.types';
import { APIResponse } from 'common/types/api';

interface CertResponse {
  data: Cert[];
}

async function getMungPlaceList() {
  const { data } = await axiosInstance.get(`/mungple/category?userId=${0}&categoryCode=CA0000&sort=NOT`);
  return data;
}

type MungpleListResponseDTO = {
  detailUrl: string;
  mungpleId: number;
  photoUrl: string;
  placeName: string;
  address: string;
  categoryCode: CategoryCode;
  certCount: number;
  bookmarkCount: number;
  isBookmarked: boolean;
}[];

async function getMungPlaceCategory(
  userId: number,
  categoryCode: string,
  sort: string,
  latitude: string,
  longitude: string,
) {
  const { data } = await axiosInstance.get<APIResponse<MungpleListResponseDTO>>(
    `/mungple/category?userId=${userId}&categoryCode=${categoryCode}&sort=${sort}&latitude=${latitude}&longitude=${longitude}`,
  );
  return data.data;
}

async function getBookmark(
  userId: number,
  sort: string,
  latitude: string,
  longitude: string,
) {
  const { data } = await axiosInstance.get<APIResponse<MungpleListResponseDTO>>(
    `/mungple/bookmark?userId=${userId}&sort=${sort}&latitude=${latitude}&longitude=${longitude}`,
  );
  return data.data;
}

function certificationLike(data: { userId: number; certificationId: number }) {
  return axiosInstance.post(`/certification/like/${data.userId}/${data.certificationId}`);
}

function reactCertification(data: {
  userId: number;
  certificationId: number;
  reactionCode: string;
}) {
  return axiosInstance.post(
    `/certification/reaction/${data.userId}/${data.certificationId}/${data.reactionCode}`,
  );
}

function registerGalleryCertificationPost(formdata: FormData) {
  return axiosInstance.post(`/certification`, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

function updateCertificationPost(data: {
  certificationId: number;
  description: string;
  userId: number;
  isHideAddress: boolean;
}) {
  return axiosInstance.put(`/certification`, {
    certificationId: data.certificationId,
    description: data.description,
    userId: data.userId,
    isHideAddress: data.isHideAddress,
  });
}

async function getCertificationPostAll(
  pageParam: number,
  userId: number,
  pageSize: number,
  dispatch: any,
  certificationId?: number,
) {
  let url = `/certification/all?page=${pageParam}&size=${pageSize}&userId=${userId}`;
  if (typeof certificationId !== 'undefined') {
    url += `&certificationId=${certificationId}`;
  }
  const res = await axiosInstance.get(url);
  const { content, last } = res.data.data;
  return { content, nextPage: pageParam + 1, last };
}

function certificationDelete(data: { userId: number; certificationId: number }) {
  return axiosInstance.delete(`/certification/${data.userId}/${data.certificationId}`);
}

async function getFiveOtherDogsCert(userId: number, count: number) {
  const { data } = await axiosInstance.get<CertResponse>(
    `/certification/recent?userId=${userId}&count=${count}`,
  );
  return data.data;
}

export {
  getMungPlaceList,
  getMungPlaceCategory,
  getBookmark,
  registerGalleryCertificationPost,
  getCertificationPostAll,
  updateCertificationPost,
  certificationLike,
  certificationDelete,
  getFiveOtherDogsCert,
  reactCertification,
};
