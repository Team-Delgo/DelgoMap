import React,{useCallback, useEffect, useRef, useState} from 'react';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftArrow from '../../common/icons/left-arrow.svg';
import { getCommentList, postComment,deleteComment } from '../../common/api/comment';
import { RootState } from '../../redux/store';
import ConfirmBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import ToastPurpleMessage from '../../common/dialog/ToastPurpleMessage';
import { analytics } from "../../index";
import {commentType} from '../../common/types/comment';
import useActive from '../../common/hooks/useActive';
import './CommentsPage.scss';
import useInput from '../../common/hooks/useInput';
import X from '../../common/icons/white-x.svg';

interface StateType {
  certificationId: number;
  posterId: number;
}

function CommentsPage() {
  const [deleteCommentId, setDeleteCommentId] = useState(-1);
  const [commentRecipient,setCommentRecipient] = useState('')
  const [commentList, setCommentList] = useState<commentType[]>([]);
  const [inputComment, onChangeInputComment,resetInputComment] = useInput('');
  const [deleteCommentBottomSheetIsOpen, openDeleteCommentBottomSheet, closeDeleteCommentBottomSheet] = useActive(false);
  const [deleteCommentSuccessToastIsOpen, openDeleteCommentSuccessToast,closeDeleteCommentSuccessToast] = useActive(false);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const profile = useSelector((state: RootState) => state.persist.user.pet.image);
  const { certificationId, posterId } = useLocation()?.state as StateType;
  const textRef = useRef<any>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const commentEvent = useAnalyticsCustomLogEvent(analytics, 'cert_comment_post');


  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    if (deleteCommentSuccessToastIsOpen) {
      setTimeout(() => {
        closeDeleteCommentSuccessToast();
      }, 2000);
    }
  }, [deleteCommentSuccessToastIsOpen]);

  const getComments = useCallback(() => {
    getCommentList(
      certificationId,
      (response: AxiosResponse) => {
        setCommentList(response.data.data);
      },
      dispatch,
    );
  }, []);

  const postCommentOnCert = useCallback(() => {
    commentEvent.mutate();
    resetInputComment();
    postComment(
      userId,
      certificationId,
      inputComment, 
      (response: AxiosResponse) => {
        if (response.data.code === 200) {
          getComments();
        }
      },
      dispatch,
    );
  }, [inputComment]);

  const deleteCommentOnCert = useCallback(() => {
    deleteComment(
      userId,
      deleteCommentId,
      certificationId,
      (response: AxiosResponse) => {
        if (response.data.code === 200) {
          openDeleteCommentSuccessToast();
          closeDeleteCommentBottomSheet();
          getComments();
        } else {
          closeDeleteCommentBottomSheet();
        }
      },
      dispatch,
    );
  }, [deleteCommentId, certificationId]);

  const handleResizeHeight = useCallback(() => {
    if (textRef.current) {
      if (textRef.current.scrollHeight <= 203) {
        textRef.current.style.height = 'auto';
        textRef.current.style.height = `${textRef.current.scrollHeight - 9}px`;
      }
    }
  }, []);


  const openBottomSheet = useCallback(
    (commentId: number) => (e: React.MouseEvent) => {
      openDeleteCommentBottomSheet();
      setDeleteCommentId(commentId);
    },
    [],
  );

  const moveToPrevPage = useCallback(()=>{
    navigate(-1);
  },[])

  const context = commentList.map((comment: commentType) => {
    return (
      <div className="comment">
        <img src={comment.profile} alt="profile" />
        <div className="comment-content">
          <div className="comment-content-header">
            <div className="comment-content-header-name">{comment.userName}</div>
            <div className="comment-content-header-work">
              <div className="comment-content-header-work-date">
                {comment.createDt.slice(0, 10)}
              </div>
              <div
                className="comment-content-header-work-delete"
                aria-hidden="true"
                onClick={
                  userId === posterId
                    ? openBottomSheet(comment.commentId)
                    : userId === comment.userId
                    ? openBottomSheet(comment.commentId)
                    : undefined
                }
                style={
                  userId === posterId
                    ? undefined
                    : userId === comment.userId
                    ? undefined
                    : { visibility: 'hidden' }
                }
              >
                삭제
              </div>
            </div>
          </div>
          <div className="comment-content-text">{comment.content}</div>
          {userId !== comment.userId && (
            <div
              className="comment-reply"
              aria-hidden="true"
              onClick={() => {
                setCommentRecipient(comment.userName)
                resetInputComment()
              }}
            >
              답글달기
            </div>
          )}
        </div>
      </div>
    );
  });

  console.log('inputComment',inputComment)

  return (
    <>
      {commentRecipient !== '' && (
        <div className="reply-comment-notification">
          <div>{commentRecipient} 에게 답글 남기는중</div>
          <img
            src={X}
            width={10.5}
            height={10.5}
            className="reply-comment-x"
            alt="reply-comment-x"
            aria-hidden="true"
            onClick={() => setCommentRecipient('')}
          />
        </div>
      )}
      <div className="comments">
        <div className="comments-header">
          <img src={LeftArrow} alt="back" onClick={moveToPrevPage} aria-hidden="true" />
          <div className="comments-header-title">댓글</div>
        </div>
        <div className="comments-context">{context}</div>
        <div className="comments-post">
          <img src={profile} alt="myprofile" />
          <textarea
            className="comments-post-input"
            ref={textRef}
            defaultValue={commentRecipient}
            value={inputComment}
            onInput={handleResizeHeight}
            onChange={onChangeInputComment}
            placeholder={commentRecipient !== '' ? `` : `댓글 남기기...`}
            autoCapitalize="off"
          />
          {/* {commentRecipient !== '' && (
            <div className="comment-recipient">{commentRecipient}</div>
          )} */}
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
