import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';


function getAchievementList(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
  axiosInstance
    .get(`/achievements/user/${userId}`)
    .then((data) => {
      console.log(data)
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

export { getAchievementList };
