import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

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

async function registerGalleryCertificationImg(
  formdata: FormData,
  certificationId: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  try {
    const result = await axiosInstance.post(
      `/photo/upload/certification/${certificationId}`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    success(result);
  } catch (err: any) {
    useErrorHandlers(dispatch, err);
  }
}

 function updateCertificationPost(data: {
  certificationId: number;
  description: string;
  userId: number;
}) {
  return axiosInstance.put(`/certification`, {
    certificationId: data.certificationId,
    description: data.description,
    userId: data.userId,
  });
}

async function getCertificationPostAll(
  pageParam: number,
  userId: number,
  pageSize: number,
  dispatch: any,
) {
  try {
    const res = await axiosInstance.get(
      `/certification/all?currentPage=${pageParam}&pageSize=${pageSize}&userId=${userId}`,
    );
    const { content, last } = res.data.data;
    return { content, nextPage: pageParam + 1, last };
  } catch (error: any) {
    useErrorHandlers(dispatch, error);
  }
}

function certificationDelete(data: { userId: number; certificationId: number }) {
  return axiosInstance.delete(`/certification/${data.userId}/${data.certificationId}`);
}

async function getFiveOtherDogsCert(
  userId: number,
  count: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  try {
    const result = await axiosInstance.get(
      `/certification/recent?userId=${userId}&count=${count}`,
    );
    success(result);
  } catch (error: any) {
    useErrorHandlers(dispatch, error);
  }
}



export {
  getMungPlaceList,
  registerGalleryCertificationPost,
  registerGalleryCertificationImg,
  getCertificationPostAll,
  updateCertificationPost,
  certificationLike,
  certificationDelete,
  getFiveOtherDogsCert,
};
