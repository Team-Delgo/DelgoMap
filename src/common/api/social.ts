import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

function setAccessCode(code: string | null, success: (data: AxiosResponse) => void, navigate: () => void, dispatch: any) {
  axiosInstance
    .post(`/oauth/kakao/${code}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      navigate();
      useErrorHandlers(dispatch, error);
    });
}

function oAuthSignup(
  formData:FormData,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  axiosInstance
    .post(`/user/oauth `, formData, {
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

function setStateCode(
  data: { code: string | null; state: string | null },
  success: (data: AxiosResponse) => void,
  navigate: () => void,
  dispatch: any,
) {
  const { code, state } = data;
  axiosInstance
    .post(`/oauth/naver/${state}/${code}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      console.log(1);
      navigate();
      useErrorHandlers(dispatch, error);
    });
}

function appleSendToken(token: string | null, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .post(`/oauth/apple/${token}`)
    .then((data) => {
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

export { setAccessCode, oAuthSignup, setStateCode, appleSendToken };
