import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
// import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

interface SignUpData {
  email: string;
  password: string;
  userName: string;
  phoneNo: string;
  geoCode: number;
  pGeoCode: number;
  petName: string;
  breed: string;
  birthday: string | undefined;
  userSocial: string;
}

function emailCheck(email: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .get(`/auth/email/check`, {
      params: { email },
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function nicknameCheck(name: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .get(`/auth/name/check`, {
      params: { name },
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function signup(info: SignUpData, success: (data: AxiosResponse) => void, dispatch: any) {
  const { userName, email, password, phoneNo, geoCode, pGeoCode, petName, breed, birthday } = info;
  axiosInstance
    .post(`/user`, {
      // user: {
      //   name: nickname,
      //   email,
      //   password,
      //   phoneNo: phone,
      // },
      // pet: {
      //   name: pet.name,
      //   birthday: pet.birthday,
      //   size: pet.size,
      //   // weight: 4.3,
      // },

      userName,
      email,
      password,
      geoCode,
      pGeoCode,
      phoneNo,
      petName,
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

function deleteUser(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .delete(`/account/user/${userId}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function getRegion(success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .get(`/code/geo`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function phoneSendMessage(phone: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .post(`/auth/sms`, {
      isJoin: false,
      phoneNo: phone
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function phoneSendMessageForFind(phone: string, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .post(`/auth/sms`, {
      isJoin: true,
      phoneNo: phone,
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function phoneCheckNumber(data: { number: string; smsId: number }, success: (data: AxiosResponse) => void, dispatch: any) {
  const { number, smsId } = data;
  axiosInstance
    .get(`/auth/sms/check`, {
      params: {
        smsId,
        enterNum: number,
      },
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

function petImageUpload(data: { formData: FormData; userId: number }, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .post(`/photo/upload/profile/${data.userId}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

async function getPetType() {
  const { data } = await axiosInstance.get(`/code/breed`);
  return data;
}

export {
  emailCheck,
  nicknameCheck,
  signup,
  deleteUser,
  phoneSendMessageForFind,
  phoneCheckNumber,
  phoneSendMessage,
  petImageUpload,
  getRegion,
  getPetType,
};
