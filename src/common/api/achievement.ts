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

async function getAchievementListByMain(userId: number) {
  const { data } = await axiosInstance.get(`/achievements/user/${userId}`);
  console.log(data);
  return data;
}

async function setMainAchievements(
  userId: number,
  firstAchievementsId: number,
  secondAchievementsId: number,
  thirdAchievementsId: number,
  success: (data: AxiosResponse) => void,
  dispatch: any,
) {
  try {
    const result = await axiosInstance.put(`/achievements/main`, {
      userId,
      first: firstAchievementsId,
      second: secondAchievementsId,
      third: thirdAchievementsId,
    });
    console.log(result);
    success(result);
  } catch (error: any) {
    useErrorHandlers(dispatch, error);
  }
}

export { getAchievementList, setMainAchievements,getAchievementListByMain };
