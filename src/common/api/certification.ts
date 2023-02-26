
import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

async function getMungPlaceList(categoryCode: string) {
  const { data } = await axiosInstance.get(`/mungple?categoryCode=CA0000`);
  return data;
}


 function certificationLike(
  data:{  userId: number,
    certificationId: number}
  // success: (data: AxiosResponse) => void,
  // dispatch: any,
){
  return axiosInstance.post(
    `/certification/like/${data.userId}/${data.certificationId}`,
  );
  // try {
  //   const result = await axiosInstance.post(`/certification/like/${userId}/${certificationId}`);
  //   console.log(result);
  //   success(result);
  // } catch (err: any) {
  //   useErrorHandlers(dispatch, err);
  // }
}

//  function certificationLike2(userId: number, certificationId: number) {
//   // const { data } = await axiosInstance.post(`/certification/like/${userId}/${certificationId}`);
//   // return data;
//   return axiosInstance.post(`/certification/like/${userId}/${certificationId}`)
// }

// async function registerCameraCertificationPost(
//   data: {
//     userId: number;
//     categoryCode: string;
//     mungpleId: number;
//     placeName: string;
//     description: string;
//     latitude: string;
//     longitude: string;
//     photo: string;
//   },
//   success: (data: AxiosResponse) => void,
//   dispatch: any,
// ) {
//   try {
//     const result = await axiosInstance.post(`/certification/live`, {
//       userId: data.userId,
//       categoryCode: data.categoryCode,
//       mungpleId: data.mungpleId,
//       placeName: data.placeName,
//       description: data.description,
//       latitude: data.latitude,
//       longitude: data.longitude,
//       photo: data.photo,
//     });
//     console.log(result);
//     success(result);
//   } catch (err: any) {
//     useErrorHandlers(dispatch, err);
//   }
// }

async function registerGalleryCertificationPost(
  data: {
    userId: number;
    categoryCode: string;
    mungpleId: number;
    placeName: string;
    description: string;
    latitude:string;
    longitude:string;
  },
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  try {
    const result = await axiosInstance.post(`/certification`, {
      userId: data.userId,
      categoryCode: data.categoryCode,
      mungpleId: data.mungpleId,
      placeName: data.placeName,
      description: data.description,
      latitude: data.latitude,
      longitude:data.longitude
    });
    console.log(result);
    success(result);
  } catch (err: any) {
    useErrorHandlers(dispatch, err);
  }
}

async function registerGalleryCertificationImg(
  formdata: FormData,
  certificationId: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  try {
    const result = await axiosInstance.post(`/photo/upload/certification/${certificationId}`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    success(result);
  } catch (err: any) {
    useErrorHandlers(dispatch, err);
  }
}

async function updateCertificationPost(
  data: {
    certificationId: number;
    description: string;
    userId: number;
  },
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  try {
    const result = await axiosInstance.put(`/certification`, {
      certificationId: data.certificationId,
      description: data.description,
      userId: data.userId,
    });
    console.log(result);
    success(result);
  } catch (err: any) {
    useErrorHandlers(dispatch, err);
  }
}

// async function getCertificationPostsByHome(userId: number) {
//   const { data } = await axiosInstance.get(`/certification/main?userId=${userId}`);
//   console.log('data', data);
//   return data;
// }

async function getCertificationPostAll(pageParam: number, userId: number, pageSize: number, dispatch: any) {
  try {
    const res = await axiosInstance.get(`/certification/all?currentPage=${pageParam}&pageSize=${pageSize}&userId=${userId}`);
    const { content, last } = res.data.data;
    return { content, nextPage: pageParam + 1, last };
  } catch (error: any) {
    useErrorHandlers(dispatch, error);
  }
}

function certificationDelete(data: { userId: number; certificationId: number }) {
  return axiosInstance.delete(`/certification/${data.userId}/${data.certificationId}`);
}

async function getFiveOtherDogsCert(userId: number, count: number, success: (data: AxiosResponse) => void, dispatch: any) {
  try {
    const result = await axiosInstance.get(`/certification/recent?userId=${userId}&count=${count}`);
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
  getFiveOtherDogsCert
};