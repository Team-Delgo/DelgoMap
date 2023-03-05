import axiosInstance from './interceptors';

function blockUser(data: { myUserId: number; blockedUserId: number }) {
  return axiosInstance.post(`/ban/${data.myUserId}/${data.blockedUserId}`);
}

export { blockUser };
