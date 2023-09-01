import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCommentList, postComment, deleteComment } from '../../common/api/comment';
import { RootState } from '../../redux/store';
import ConfirmBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import ToastPurpleMessage from '../../common/dialog/ToastPurpleMessage';
import { analytics } from '../../index';
import { commentType } from '../../common/types/comment';
import useActive from '../../common/hooks/useActive';
import './CommentsPage.scss';
import useInput from '../../common/hooks/useInput';
import { postType } from '../../common/types/post';
import PageHeader from '../../components/PageHeader';
import { useErrorHandlers } from '../../common/api/useErrorHandlers';
import DogLoading from '../../common/utils/BallLoading';
import { RECORD_PATH } from '../../common/constants/path.const';

interface StateType {
  post: postType;
}

function CommentsPage() {
  const [deleteCommentId, setDeleteCommentId] = useState(-1); //댓글Id(댓글삭제 api 호출시 필요)
  const [inputComment, onChangeInputComment, resetInputComment] = useInput(''); //input에 입력하는 댓글
  const [
    deleteCommentBottomSheetIsOpen,
    openDeleteCommentBottomSheet,
    closeDeleteCommentBottomSheet,
  ] = useActive(false); //댓글삭제 바텀시트
  const [
    deleteCommentSuccessToastIsOpen,
    openDeleteCommentSuccessToast,
    closeDeleteCommentSuccessToast,
  ] = useActive(false); //댓글삭제 tost
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const profile = useSelector((state: RootState) => state.persist.user.pet.image);
  const { post } = useLocation()?.state as StateType;
  const textRef = useRef<any>(null); //textarea 높이설정을 위한 ref객체
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const commentEvent = useAnalyticsCustomLogEvent(analytics, 'cert_comment_post');

  const {
    data: commentList,
    refetch: refetchCommentList,
    isLoading: getCommentListIsLoading,
  } = useQuery('comments', () => getCommentList(post?.certificationId)); //댓글리스트 api 훅

  const { mutate: postCommentMutate, isLoading: postCommentIsLoading } = useMutation(
    //댓글생성 api 훅
    ({
      userId,
      certificationId,
      content,
    }: {
      userId: number;
      certificationId: number;
      content: string;
    }) => postComment(userId, certificationId, content),
    {
      onSuccess: (response: AxiosResponse) => {
        //생성성공하면
        if (response.data.code === 200) {
          resetInputComment(); //input창 값 초기화
          refetchCommentList(); //댓글리스트 refetch(stale -> fresh)
        }
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  //댓글삭제 api 훅
  const { mutate: deleteCommentMutate, isLoading: deleteCommentIsLoading } = useMutation(
    ({
      userId,
      commentId,
      certificationId,
    }: {
      userId: number;
      commentId: number;
      certificationId: number;
    }) => deleteComment(userId, commentId, certificationId),
    {
      onSuccess: (response: AxiosResponse) => {
        if (response.data.code === 200) {
          openDeleteCommentSuccessToast(); //댓글삭제 toast 열고
          closeDeleteCommentBottomSheet(); //댓글삭제 bottom sheet 닫고
          refetchCommentList(); //댓글리스트 refetch(stale -> fresh)

          setTimeout(() => {
            closeDeleteCommentSuccessToast(); //deleteCommentSuccessToastIsOpen open되면 2초후에 닫아줌
          }, 2000);
        } else {
          closeDeleteCommentBottomSheet();
        }
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  //댓글 생성 핸들러
  const postCommentOnCert = () => {
    commentEvent.mutate();
    resetInputComment();

    const data = {
      userId,
      certificationId: post.certificationId,
      content: inputComment,
    };

    postCommentMutate(data);
  };

  //댓글 삭제 핸들러
  const deleteCommentOnCert = () => {
    deleteCommentMutate({
      userId,
      commentId: deleteCommentId,
      certificationId: post.certificationId,
    });
  };

  //textarea 높이 설정
  const handleResizeHeight = useCallback(() => {
    if (textRef.current) {
      if (textRef.current.scrollHeight <= 203) {
        textRef.current.style.height = 'auto';
        textRef.current.style.height = `${textRef.current.scrollHeight - 9}px`;
      }
    }
  }, []);

  const profileClickHandler = (commentId: number) => {
    if (commentId) {
      console.log(commentId);
      navigate(`${RECORD_PATH.PHOTO}/${commentId}`, {
        state: {
          prevPath: location.pathname,
        },
      });
    }
  };

  //댓글삭제 바텀시트 오픈 (삭제한 댓글id 저장)
  const openBottomSheet = useCallback(
    (commentId: number) => (e: React.MouseEvent) => {
      openDeleteCommentBottomSheet();
      setDeleteCommentId(commentId);
    },
    [],
  );

  const moveToPrevPage = useCallback(() => {
    navigate(-1);
  }, []);

  const isLoading =
    getCommentListIsLoading || postCommentIsLoading || deleteCommentIsLoading;

  const context = commentList?.data?.map((comment: commentType) => {
    return (
      <div className="comment">
        <img
          src={comment.userProfile}
          alt="profile"
          onClick={() => profileClickHandler(comment.userId)}
        />
        <div className="comment-content">
          <div className="comment-content-header">
            <div className="comment-content-header-name">{comment.userName}</div>
            <div className="comment-content-header-work">
              <div
                className="comment-content-header-work-delete"
                aria-hidden="true"
                onClick={
                  userId === post.userId
                    ? openBottomSheet(comment.commentId)
                    : userId === comment.userId
                    ? openBottomSheet(comment.commentId)
                    : undefined
                }
                style={
                  userId === post.userId
                    ? undefined
                    : userId === comment.userId
                    ? undefined
                    : { visibility: 'hidden' }
                }
              >
                삭제
              </div>
              <div className="comment-content-header-work-date">
                {comment.registDt.slice(0, 10)}
              </div>
            </div>
          </div>
          <div className="comment-content-text">{comment.content}</div>
        </div>
      </div>
    );
  });

  return (
    <>
      {isLoading && <DogLoading />}
      <div className="comments">
        <PageHeader title="댓글" navigate={moveToPrevPage} />
        {!getCommentListIsLoading && <div className="comments-context">{context}</div>}
        <div className="comments-post">
          <img src={profile} alt="myprofile" />
          <textarea
            ref={textRef}
            value={inputComment}
            onInput={handleResizeHeight}
            onChange={onChangeInputComment}
            placeholder={`${post?.userName}에게 댓글 남기기...`}
            className="comments-post-input"
          />
          <div
            aria-hidden="true"
            onClick={inputComment.length > 0 ? postCommentOnCert : undefined}
            className={
              inputComment.length > 0
                ? 'comments-post-button'
                : 'comments-post-button-disabled'
            }
          >
            완료
          </div>
        </div>
      </div>
      <ConfirmBottomSheet
        text="댓글을 삭제하실건가요?"
        description="지우면 다시 볼 수 없어요"
        cancelText="취소"
        acceptText="삭제"
        acceptButtonHandler={deleteCommentOnCert}
        cancelButtonHandler={closeDeleteCommentBottomSheet}
        bottomSheetIsOpen={deleteCommentBottomSheetIsOpen}
      />
      {deleteCommentSuccessToastIsOpen && (
        <ToastPurpleMessage message="댓글이 삭제 되었습니다." />
      )}
    </>
  );
}

export default CommentsPage;
