import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';


function getAchievementList(userId: number, success: (data: AxiosResponse) => void, dispatch: any) {
   axios
    .get(`https://www.reward.delgo.pet:8443/achievements/user/${userId}`)
    .then((data) => {
      console.log(data)
      success(data);
    })
    .catch((error) => {
      useErrorHandlers(dispatch, error);
    });
}

async function getAchievementListByMain(userId: number) {
  const { data } = await axios.get(`https://www.reward.delgo.pet:8443/achievements/user/${userId}`);
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
    const result = await axios.put(`https://www.reward.delgo.pet:8443/achievements/main`, {
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
