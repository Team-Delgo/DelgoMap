import axiosInstance from './interceptors';
import { Cert } from '../types/map';

interface CertResponse {
  data: Cert[];
}

async function getMungPlaceList() {
  const { data } = await axiosInstance.get(`/mungple/category/CA0000`);
  return data;
}

function certificationLike(data: { userId: number; certificationId: number }) {
  return axiosInstance.post(`/certification/like/${data.userId}/${data.certificationId}`);
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
    const res = await axiosInstance.get(
      `/certification/all?page=${pageParam}&size=${pageSize}&userId=${userId}&certificationId=${certificationId}`,
    );
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
  registerGalleryCertificationPost,
  getCertificationPostAll,
  updateCertificationPost,
  certificationLike,
  certificationDelete,
  getFiveOtherDogsCert,
};
