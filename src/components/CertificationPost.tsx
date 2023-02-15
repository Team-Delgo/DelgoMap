import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { certificationLike, deleteCertificationPost } from '../common/api/certification';
import Heart from '../common/icons/heart-empty.svg';
import FillHeart from '../common/icons/heart.svg';
import Comments from '../common/icons/comments.svg';
import { RootState } from '../redux/store';
import { CAMERA_PATH, SIGN_IN_PATH } from '../common/constants/path.const';
import { uploadAction } from '../redux/slice/uploadSlice';
import { scrollActions } from '../redux/slice/scrollSlice';
import DeleteBottomSheet from '../common/dialog/ConfirmBottomSheet';
import ToastPurpleMessage from '../common/dialog/ToastPurpleMessage';
import { banUser } from '../common/api/ban';
import { analytics } from '../index';
import { postType } from '../common/types/post';
import { weekDay } from '../common/types/week';
// import { categoryIcon2, categoryCode2 } from '../common/types/category';
import useActive from '../common/hooks/useActive';
import AlertConfirm from '../common/dialog/AlertConfirm';

interface CertificationPostPropsType {
  post: postType;
  refetch: () => void;
  pageSize: number;
}

function CertificationPost({ post, refetch, pageSize }: CertificationPostPropsType) {
  const [likeCount, setLikeCount] = useState(post?.likeCount);
  const [blockedUserName, setBlockedUserName] = useState(post?.likeCount);
  const [isLike, activeLike,inActiveLike] = useActive(post?.isLike);
  const [deleteBottomSheetIsOpen, openDeleteBottomSheet, closeDelteBottomSheet] = useActive(false);
  const [deletePostSuccessToastIsOpen, openDeletePostSuccessToast, closeDeletePostSuccessToast] = useActive(false);
  const [blockUserbottomSheetIsOpen, openBlockUserBottomSheet, closeBlockUserBottomSheet] = useActive(false);
  const [blockUserSuccessToastIsOpen, openBlockUserSuccessToastIsOpen, closeBlockUserSuccessToast] = useActive(false);
  const [loginAlertIsOpen, setLoginAlertIsOpen] = useState(false);
  const { user,isSignIn } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const heartEvent = useAnalyticsCustomLogEvent(analytics, 'cert_like');
  const commentEvent = useAnalyticsCustomLogEvent(analytics, 'cert_comment_view');
  const profileImgRef = useRef<HTMLImageElement>(null);
  const postImgRef = useRef<HTMLImageElement>(null);

  const observeImg = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observeImg);
    profileImgRef.current && observer.observe(profileImgRef.current);
    postImgRef.current && observer.observe(postImgRef.current);
  }, []);


  useEffect(() => {
    if (deletePostSuccessToastIsOpen) {
      setTimeout(() => {
        closeDeletePostSuccessToast();
      }, 2000);
    }
  }, [deletePostSuccessToastIsOpen]);

  useEffect(() => {
    if (blockUserSuccessToastIsOpen) {
      setTimeout(() => {
        closeBlockUserSuccessToast();
      }, 2000);
    }
  }, [blockUserSuccessToastIsOpen]);

  const handleCertificationLike = () => {
    if(!isSignIn){
      setLoginAlertIsOpen(true)
      return
    }
    setLikeCount(isLike ? likeCount - 1 : likeCount + 1);

    if(isLike) inActiveLike()
    else activeLike()

    certificationLike(
      user.id,
      post?.certificationId,
      (response: AxiosResponse) => {
        if (response.data.code === 200) {
          heartEvent.mutate();
        }
      },
      dispatch,
    );
  };

  const deleteCertification = useCallback(() => {
    deleteCertificationPost(
      user.id,
      post?.certificationId,
      (response: AxiosResponse) => {
        const { code } = response.data;
        if (code === 200) {
          openDeletePostSuccessToast();
          closeDelteBottomSheet();
          refetch();
        } else {
          closeDelteBottomSheet();
        }
      },
      dispatch,
    );
  }, []);

  const handleBlockUser = useCallback(() => {
    banUser(
      user.id,
      post?.user?.userId,
      (response: AxiosResponse) => {
        const { code, data } = response.data;
        if (code === 200) {
          setBlockedUserName(data?.name);
          openBlockUserSuccessToastIsOpen();
          closeBlockUserBottomSheet();
          refetch();
        } else {
          closeBlockUserBottomSheet();
        }
      },
      dispatch,
    );
  }, []);

  const moveToCommentPage = () => {
    if(!isSignIn){
      setLoginAlertIsOpen(true)
      return
    }
    commentEvent.mutate();
    dispatch(scrollActions.postsScroll({ scroll: window.scrollY, pageSize }));
    navigate(`/comments/${post?.certificationId}`, {
      state: { certificationId: post?.certificationId, posterId: post?.userId },
    });
  };

  const moveToUpdatePage = () => {
    dispatch(scrollActions.postsScroll({ scroll: window.scrollY, pageSize }));
    dispatch(
      uploadAction.setCertificationUpdate({
        img: post?.photoUrl,
        // categoryKo: categoryCode2[post?.categoryCode],
        title: post?.placeName,
        certificationId: post?.certificationId,
        content: post?.description,
        address: post?.address
      }),
    );
    navigate(CAMERA_PATH.UPDATE, {
      state: {
        prevPath: location.pathname,
      },
    });
  };
  const closeAlert = () => {
    setLoginAlertIsOpen(false);
  };

  const sendLoginPage = () => {
    navigate(SIGN_IN_PATH.MAIN);
  };

  return (
    <>
      <header className="post-img-result-header">
        <div className="post-img-result-header-profile">
          <img className="post-img-result-header-profile-img" data-src={post?.user.profile} ref={profileImgRef} alt="copy url" />
          <div>
            <div className="post-img-result-header-profile-date">
              {' '}
              {post?.registDt.substring(0, 10)}&nbsp;
              {weekDay[post?.registDt.substring(17, post?.registDt.length)]}
              &nbsp;&nbsp;
              {post?.registDt.substring(11, 16)}
            </div>
            <div className="post-img-result-header-profile-name">{post?.user?.name}</div>
          </div>
        </div>
        {isSignIn === false ? null : user.id !== post?.user.userId ? (
          <div className="post-img-result-header-report" aria-hidden="true" onClick={openBlockUserBottomSheet}>
            차단
          </div>
        ) : (
          <div className="post-img-result-header-report">
            <div aria-hidden="true" onClick={moveToUpdatePage}>
              수정&nbsp;&nbsp;|
            </div>
            <div aria-hidden="true" onClick={openDeleteBottomSheet}>
              &nbsp;&nbsp;삭제
            </div>
          </div>
        )}
      </header>
      <main className="post-img-result-main">
        <img className="post-img-result-main-img" src={post?.photoUrl} data-src={post?.photoUrl} width={window.innerWidth} ref={postImgRef} alt="postImg" />
        <header className="post-img-result-main-header">
          <div className="post-img-result-main-header-place">
            <div className="post-img-result-main-header-place-name">{post?.placeName}</div>
            <div className="post-img-result-main-header-place-address">{post?.address}</div>
          </div>
        </header>
        <body className="post-img-result-main-body">{post?.description}</body>
        <footer className="post-img-result-main-footer">
          <img
            className="post-img-result-main-footer-heart"
            src={isLike ? FillHeart : Heart}
            alt="heart"
            aria-hidden="true"
            onClick={handleCertificationLike}
          />
          <div className="post-img-result-main-footer-count">{likeCount}</div>
          <img
            className="post-img-result-main-footer-comments"
            src={Comments}
            alt="comments"
            aria-hidden="true"
            onClick={moveToCommentPage}
          />
          <div className="post-img-result-main-footer-count">{post?.commentCount}</div>
        </footer>
      </main>
      <div className="border-line" />
      {deletePostSuccessToastIsOpen && <ToastPurpleMessage message="게시물이 삭제 되었습니다." />}
      <DeleteBottomSheet
        text="기록을 삭제하실건가요?"
        description="지우면 다시 볼 수 없어요"
        cancelText="취소"
        acceptText="삭제"
        acceptButtonHandler={deleteCertification}
        cancelButtonHandler={closeDelteBottomSheet}
        bottomSheetIsOpen={deleteBottomSheetIsOpen}
      />

      {blockUserSuccessToastIsOpen && <ToastPurpleMessage message={`${blockedUserName}님을 신고 하였습니다`} />}
      <DeleteBottomSheet
        text={`${post?.user?.name} 님을 신고 하시겠어요?`}
        description={`앞으로 ${post?.user?.name} 님의 게시물을 볼 수 없어요`}
        cancelText="취소"
        acceptText="신고"
        acceptButtonHandler={handleBlockUser}
        cancelButtonHandler={closeBlockUserBottomSheet}
        bottomSheetIsOpen={blockUserbottomSheetIsOpen}
      />
      {loginAlertIsOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={sendLoginPage}
          noButtonHandler={closeAlert}
        />
      )}
    </>
  );
}

export default CertificationPost;
