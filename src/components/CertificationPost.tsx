import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { certificationDelete, certificationLike } from '../common/api/certification';
import Heart from '../common/icons/heart-empty.svg';
import FillHeart from '../common/icons/heart.svg';
import Comments from '../common/icons/comments.svg';
import DogLoading from '../common/icons/dog-loading.svg';
import { RootState } from '../redux/store';
import { UPLOAD_PATH, SIGN_IN_PATH, RECORD_PATH } from '../common/constants/path.const';
import { uploadAction } from '../redux/slice/uploadSlice';
import { scrollActions } from '../redux/slice/scrollSlice';
import DeleteBottomSheet from '../common/dialog/ConfirmBottomSheet';
import ToastPurpleMessage from '../common/dialog/ToastPurpleMessage';
import { blockUser } from '../common/api/ban';
import { analytics } from '../index';
import { postType } from '../common/types/post';
import { weekDay } from '../common/types/week';
import useActive from '../common/hooks/useActive';
import AlertConfirm from '../common/dialog/AlertConfirm';
import { useErrorHandlers } from '../common/api/useErrorHandlers';
import LikeAnimation from '../common/utils/LikeAnimation';

interface CertificationPostPropsType {
  post: postType;
  certificationPostsFetch: () => void;
  pageSize: number;
}

interface CertificationLIkeDataType {
  userId: number;
  certificationId: number;
}

interface UserBlockDataType {
  myUserId: number;
  blockedUserId: number;
}

function CertificationPost({
  post,
  certificationPostsFetch,
  pageSize,
}: CertificationPostPropsType) {
  const [clickCount, setClickCount] = useState(0);
  const [LikeAnimationLoading, setLikeAnimationLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likeCount);
  const [blockedUserName, setBlockedUserName] = useState('');
  const [isLike, setIsLike] = useState(post?.isLike);
  const [deleteBottomSheetIsOpen, openDeleteBottomSheet, closeDelteBottomSheet] =
    useActive(false);
  const [
    deletePostSuccessToastIsOpen,
    openDeletePostSuccessToast,
    closeDeletePostSuccessToast,
  ] = useActive(false);
  const [
    blockUserbottomSheetIsOpen,
    openBlockUserBottomSheet,
    closeBlockUserBottomSheet,
  ] = useActive(false);
  const [
    blockUserSuccessToastIsOpen,
    openBlockUserSuccessToastIsOpen,
    closeBlockUserSuccessToast,
  ] = useActive(false);
  const [loginAlertIsOpen, setLoginAlertIsOpen] = useState(false);
  const { user, isSignIn } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const heartEvent = useAnalyticsCustomLogEvent(analytics, 'cert_like');
  const commentEvent = useAnalyticsCustomLogEvent(analytics, 'cert_comment_view');
  const mainImg = useRef<HTMLImageElement>(null);
  const profileImg = useRef<HTMLImageElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const observeImg = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observeImg);
    mainImg.current && observer.observe(mainImg.current);
    profileImg.current && observer.observe(profileImg.current);
  }, [post]);

  useEffect(() => {
    setLikeCount(post?.likeCount);
    setIsLike(post?.isLike);
  }, [post]);

  useEffect(() => {
    if (blockUserSuccessToastIsOpen) {
      setTimeout(() => {
        closeBlockUserSuccessToast();
      }, 2000);
    }
  }, [blockUserSuccessToastIsOpen]);

  const { mutate: certificationLikeMutate, isLoading: isLoadingCertificationLike } =
    useMutation((data: CertificationLIkeDataType) => certificationLike(data), {
      onSuccess: () => {
        heartEvent.mutate();
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    });

  const { mutate: certificationDeleteMutate, isLoading: cettificationDeleteIsLoading } =
    useMutation((data: CertificationLIkeDataType) => certificationDelete(data), {
      onSuccess: (response: AxiosResponse) => {
        const { code } = response.data;
        if (code === 200) {
          closeDelteBottomSheet();
          openDeletePostSuccessToast();
          certificationPostsFetch();
          setTimeout(() => {
            closeDeletePostSuccessToast();
          }, 2000);
        } else {
          closeDelteBottomSheet();
        }
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    });

  const { mutate: userBlockMutate, isLoading: userBlockIsLoading } = useMutation(
    (data: UserBlockDataType) => blockUser(data),
    {
      onSuccess: (response: AxiosResponse) => {
        const { code, data } = response.data;
        if (code === 200) {
          setBlockedUserName(data?.name);
          openBlockUserSuccessToastIsOpen();
          closeBlockUserBottomSheet();
          certificationPostsFetch();
        } else {
          closeBlockUserBottomSheet();
        }
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );
  const profileClickHandler = () => {
    if (post.userId) {
      console.log(post.userId);
      navigate(`${RECORD_PATH.PHOTO}/${post.userId}`, {
        state: {
          prevPath: location.pathname,
        },
      });
    }
  };
  const handleCertificationLike = () => {
    if (!isSignIn) {
      setLoginAlertIsOpen(true);
      return;
    }
    setLikeCount(isLike ? likeCount - 1 : likeCount + 1);
    if (isLike) setIsLike(false);
    else setIsLike(true);

    certificationLikeMutate({
      userId: user?.id,
      certificationId: post?.certificationId,
    });
  };

  const handleCertificationDelete = () => {
    if (userBlockIsLoading) return;
    certificationDeleteMutate({
      userId: user?.id,
      certificationId: post?.certificationId,
    });
  };

  const handleUserBlock = () => {
    if (cettificationDeleteIsLoading) return;
    userBlockMutate({
      myUserId: user?.id,
      blockedUserId: post?.userId,
    });
  };

  const moveToCommentPage = () => {
    if (!isSignIn) {
      setLoginAlertIsOpen(true);
      return;
    }
    commentEvent.mutate();
    dispatch(scrollActions.postsScroll({ scroll: window.scrollY, pageSize }));
    navigate(`/comments/${post?.certificationId}`, {
      state: { post },
    });
  };

  const moveToUpdatePage = () => {
    dispatch(scrollActions.postsScroll({ scroll: window.scrollY, pageSize }));
    dispatch(
      uploadAction.setCertificationUpdate({
        img: post?.photoUrl,
        title: post?.placeName,
        certificationId: post?.certificationId,
        content: post?.description,
        address: post?.address,
        isHideAddress: post?.isHideAddress,
        // mongPlaceId:post?.
      }),
    );
    navigate(UPLOAD_PATH.UPDATE, {
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

  const handleDoubleClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setClickCount((prevCount: number) => {
      const newCount = prevCount + 1;
      if (newCount === 2) {
        setLikeAnimationLoading(true);
        console.log(1);
        handleCertificationLike();

        timeoutRef.current = setTimeout(() => setClickCount(0), 1000);
        setTimeout(() => setLikeAnimationLoading(false), 500);
      } else {
        timeoutRef.current = setTimeout(() => setClickCount(0), 1000);
      }
      return newCount;
    });
  };

  return (
    <>
      <header className="post-img-result-header">
        <div className="post-img-result-header-profile">
          <img
            className="post-img-result-header-profile-img"
            onClick={profileClickHandler}
            src={post?.userProfile}
            alt="copy url"
            ref={profileImg}
            width={39}
            height={39}
            data-src={post?.userProfile ? post.userProfile : DogLoading}
          />
          <div>
            <div className="post-img-result-header-profile-date">
              {' '}
              {post?.registDt?.substring(0, 10)}&nbsp;
              {weekDay[post?.registDt.substring(17, post?.registDt.length)]}
              &nbsp;&nbsp;
              {post?.registDt.substring(11, 16)}
            </div>
            <div className="post-img-result-header-profile-name">{post?.userName}</div>
          </div>
        </div>
        {isSignIn === false ? null : user.id !== post?.userId ? (
          <div
            className="post-img-result-header-report"
            aria-hidden="true"
            onClick={openBlockUserBottomSheet}
          >
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
        <img
          className="post-img-result-main-img"
          ref={mainImg}
          data-src={post.photoUrl ? post.photoUrl : DogLoading}
          src={DogLoading}
          width={window.innerWidth}
          height={window.innerWidth}
          alt="postImg"
          aria-hidden="true"
          onClick={handleDoubleClick}
        />
        {LikeAnimationLoading && (
          <div className="like-animation-wrapper" style={{ height: window.innerWidth }}>
            <LikeAnimation isLike={isLike} />
          </div>
        )}
        <header className="post-img-result-main-header">
          <div className="post-img-result-main-header-place">
            <div className="post-img-result-main-header-place-name">
              {post?.placeName}
            </div>
            {!post?.isHideAddress && (
              <div className="post-img-result-main-header-place-address">
                {post?.address}
              </div>
            )}
          </div>
        </header>
        <body className="post-img-result-main-body">{post?.description}</body>
        <footer className="post-img-result-main-footer">
          <div className="post-img-result-main-footer-heart-wrapper">
            <img
              className="post-img-result-main-footer-heart"
              src={isLike ? FillHeart : Heart}
              width={22}
              height={22}
              alt="heart"
              aria-hidden="true"
              onClick={handleCertificationLike}
            />
            {likeCount > 0 && (
              <div className="post-img-result-main-footer-count">{likeCount}</div>
            )}
          </div>
          <div className="post-img-result-main-footer-comments-wrapper">
            <img
              className="post-img-result-main-footer-comments"
              src={Comments}
              alt="comments"
              width={22}
              height={22}
              aria-hidden="true"
              onClick={moveToCommentPage}
            />
            {post?.commentCount > 0 && (
              <div className="post-img-result-main-footer-count">
                {post?.commentCount}
              </div>
            )}
          </div>
        </footer>
      </main>
      <div className="border-line" />
      {deletePostSuccessToastIsOpen && (
        <ToastPurpleMessage message="게시물이 삭제 되었습니다." />
      )}
      <DeleteBottomSheet
        text="기록을 삭제하실건가요?"
        description="지우면 다시 볼 수 없어요"
        cancelText="취소"
        acceptText="삭제"
        acceptButtonHandler={handleCertificationDelete}
        cancelButtonHandler={closeDelteBottomSheet}
        bottomSheetIsOpen={deleteBottomSheetIsOpen}
      />

      {blockUserSuccessToastIsOpen && (
        <ToastPurpleMessage message={`${blockedUserName}님을 차단 하였습니다`} />
      )}
      <DeleteBottomSheet
        text={`${post?.userName} 님을 차단 하시겠어요?`}
        description={`앞으로 ${post?.userName} 님의 게시물을 볼 수 없어요`}
        cancelText="취소"
        acceptText="차단"
        acceptButtonHandler={handleUserBlock}
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
