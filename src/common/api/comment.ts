import axiosInstance from './interceptors';

async function getCommentList(certificationId: number) {
  const { data } = await axiosInstance.get(`/comment?certificationId=${certificationId}`);
  return data;
}

function postComment(userId: number, certificationId: number, content: string) {
  return axiosInstance.post(`/comment`, {
    userId,
    certificationId,
    isReply: false,
    content,
  });
}

function deleteComment(userId: number, commentId: number, certificationId: number) {
  return axiosInstance.delete(`/comment/${commentId}/${userId}/${certificationId}`);
}

export { getCommentList, postComment, deleteComment };
