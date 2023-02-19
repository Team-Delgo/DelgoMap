import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';

async function getAchievementList(userId: number) {
  const { data } = await axiosInstance.get(`/achievements/user/${userId}`);

  return data;
}

export { getAchievementList };

// /useErrorHandlers(dispatch, error);
