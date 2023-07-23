import axios from 'axios';
import axiosInstance from './interceptors';

function login(info: { email: string; password: string }) {
  const data = axios.post(`https://www.test.delgo.pet/login`, {
    email: info.email,
    password: info.password,
  });
  return data;
}

async function emailAuth(email: string) {
  const data = await axiosInstance.get(`/auth/email`, {
    params: { email },
  });
  return data;
}

function changePassword(
  email: string,
  password: string,
  success: () => void,
) {
  axiosInstance
    .put(`/user/password`, {
      email,
      newPassword: password,
    })
    .then(() => {
      success();
    })
}

export { login, emailAuth, changePassword };
