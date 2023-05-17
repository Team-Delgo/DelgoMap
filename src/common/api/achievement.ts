import axiosInstance from './interceptors';

async function getAchievementList(userId: number) {
  const { data } = await axiosInstance.get(`/achievements/user/${userId}`);
  return data;
}

export { getAchievementList };
