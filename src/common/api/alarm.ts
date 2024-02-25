import axiosInstance from './interceptors';

async function getAlarmList(userId: number) {
  const { data } = await axiosInstance.get(`notification?userId=${userId}`);
  return data;
}

async function getNewAlarm(userId: number) {
  const { data } = await axiosInstance.get(`notification/new?userId=${userId}`);
  return data;
}


export { getAlarmList,getNewAlarm };
