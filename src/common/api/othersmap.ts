import { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';

async function postVeiwCount(userId: number) {
  const response = await axiosInstance.post<AxiosResponse<number>>(
    `/user/view/${userId}`,
  );
  return response.data.data;
}
async function getUserInfo(userId: number) {
  const response = await axiosInstance.get<AxiosResponse>(`/map/other?userId=${userId}`);
  console.log(response.data);
  return response.data.data;
}

export { postVeiwCount, getUserInfo };
