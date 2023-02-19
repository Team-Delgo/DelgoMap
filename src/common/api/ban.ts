import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

function blockUser(data: { myUserId: number; blockedUserId: number }) {
  return axiosInstance.post(`/ban/${data.myUserId}/${data.blockedUserId}`);
}

export { blockUser };
