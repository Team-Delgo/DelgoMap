/* eslint-disable dot-notation */
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SIGN_IN_PATH } from 'common/constants/path.const';
import store from 'redux/store';
import { userActions } from 'redux/slice/userSlice';
import axiosInstance from './interceptors';

function login(info: { email: string; password: string }) {
  const data = axios.post(`https://www.test.delgo.pet/login`, {
    email: info.email,
    password: info.password,
  });
  return data;
}

async function emailAuth(email: string) {
  const data = await axios.get(`${process.env.REACT_APP_API_URL}/auth/email`, {
    params: { email },
  });
  return data;
}

function changePassword(email: string, password: string, success: () => void) {
  axiosInstance
    .put(`/user/password`, {
      email,
      newPassword: password,
    })
    .then(() => {
      success();
    });
}

async function tokenRefresh() {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/token/reissue`, {
      withCredentials: true,
    });
    axiosInstance.defaults.headers.authorization_access = `Bearer ${response.headers['Authorization_Access']}`;
  } catch {
    console.log('refresh token stale');
    store.dispatch(userActions.signout());
  }
}

export { login, emailAuth, changePassword, tokenRefresh };
