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
import { CAMERA_PATH, SIGN_IN_PATH } from '../common/constants/path.const';
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
    setLikeCount(post?.likeCount)
    setIsLike(post?.isLike)
  }, [post]);

  useEffect(() => {
    if (blockUserSuccessToastIsOpen) {
      setTimeout(() => {
        closeBlockUserSuccessToast();
      }, 2000);
    }
  }, [blockUserSuccessToastIsOpen]);

  const { mutate: certificationLikeMutate } = useMutation(
    (data: CertificationLIkeDataType) => certificationLike(data),
    {
      onSuccess: () => {
        heartEvent.mutate();
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

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
          <img
            className="post-img-result-header-profile-img"
            src={post?.user?.profile}
            alt="copy url"
            ref={profileImg}
            width={39}
            height={39}
            data-src={post?.user?.profile ? post.user?.profile : DogLoading}
          />
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
        />
        <header className="post-img-result-main-header">
          <div className="post-img-result-main-header-place">
            <div className="post-img-result-main-header-place-name">
              {post?.placeName}
            </div>
            <div className="post-img-result-main-header-place-address">
              {post?.address}
            </div>
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
          {likeCount > 0 && (
            <div className="post-img-result-main-footer-count">{likeCount}</div>
          )}
          <img
            className="post-img-result-main-footer-comments"
            src={Comments}
            alt="comments"
            aria-hidden="true"
            onClick={moveToCommentPage}
          />
          {post?.commentCount > 0 && (
            <div className="post-img-result-main-footer-count">{post?.commentCount}</div>
          )}
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
        text={`${post?.user?.name} 님을 차단 하시겠어요?`}
        description={`앞으로 ${post?.user?.name} 님의 게시물을 볼 수 없어요`}
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
