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

interface StateType {
  certificationId: number;
  posterId: number;
}

function CommentsPage() {
  const [deleteCommentId, setDeleteCommentId] = useState(-1);
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
          resetInputComment();
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
              <div className="comment-content-header-work-date">{comment.createDt.slice(0, 10)}</div>
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
                style={userId === posterId ? undefined : userId === comment.userId ? undefined : { visibility: 'hidden' }}
              >
                ??????
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
      <div className="comments">
        <div className="comments-header">
          <img
            src={LeftArrow}
            alt="back"
            onClick={moveToPrevPage}
            aria-hidden="true"
          />
          <div className="comments-header-title">??????</div>
        </div>
        <div className="comments-context">{context}</div>
        <div className="comments-post">
          <img src={profile} alt="myprofile" />
          <textarea
            ref={textRef}
            value={inputComment}
            onInput={handleResizeHeight}
            // onAbort={handleResizeHeight}
            onChange={onChangeInputComment}
            placeholder="?????? ?????????..."
            className="comments-post-input"
          />
          <div
            aria-hidden="true"
            onClick={inputComment.length > 0 ? postCommentOnCert : undefined}
            className={inputComment.length > 0 ? 'comments-post-button' : 'comments-post-button-disabled'}
          >
            ??????
          </div>
        </div>
      </div>
      <ConfirmBottomSheet
        text="????????? ??????????????????????"
        description="????????? ?????? ??? ??? ?????????"
        cancelText="??????"
        acceptText="??????"
        acceptButtonHandler={deleteCommentOnCert}
        cancelButtonHandler={closeDeleteCommentBottomSheet}
        bottomSheetIsOpen={deleteCommentBottomSheetIsOpen}
      />
      {deleteCommentSuccessToastIsOpen && <ToastPurpleMessage message="????????? ?????? ???????????????." />}
    </>
  );
}

export default CommentsPage;
