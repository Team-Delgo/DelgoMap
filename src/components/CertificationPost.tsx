import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { certificationDelete, reactCertification } from '../common/api/certification';
import DogLoading from '../common/icons/dog-loading.svg';
import CuteIcon from '../common/icons/react-cute.svg';
import HelpIcon from '../common/icons/react-help.svg';
import DefaultIcon from '../common/icons/react-default.svg';
import { RootState } from '../redux/store';
import {
  UPLOAD_PATH,
  SIGN_IN_PATH,
  RECORD_PATH,
  ROOT_PATH,
} from '../common/constants/path.const';
import { uploadAction } from '../redux/slice/uploadSlice';
import { scrollActions } from '../redux/slice/scrollSlice';
import DeleteBottomSheet from '../common/dialog/ConfirmBottomSheet';
import ToastPurpleMessage from '../common/dialog/ToastPurpleMessage';
import { blockUser } from '../common/api/ban';
import { analytics } from '../index';
import { postType } from '../common/types/post';
import { Cert } from 'page/map/index.types';
import { weekDay } from '../common/types/week';
import useActive from '../common/hooks/useActive';
import AlertConfirm from '../common/dialog/AlertConfirm';
import { useErrorHandlers } from '../common/api/useErrorHandlers';
import FullScreenImageSlider from '../page/detail/components/FullScreenImageSlider';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { reactParam } from 'common/constants/parameter.const';

interface CertificationPostPropsType {
  post: postType;
  certificationPostsFetch: () => void;
  pageSize: number;
  openFullScreenSlider?: (images: string[], index: number, placeName:string) => void;
}
interface CertificationReactDataType {
  userId: number;
  certificationId: number;
  reactionCode: string;
}
interface CertificationDeleteDataType {
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
  openFullScreenSlider
}: CertificationPostPropsType) {
  const [moredesc, setMoreDesc] = useState(false);
  const [imageNumber, setImageNumber] = useState(0);
  const [blockedUserName, setBlockedUserName] = useState('');
  const [helpCount, setHelpCount] = useState(post?.reactionCountMap?.HELPER);
  const [cuteCount, setCuteCount] = useState(post?.reactionCountMap?.CUTE);
  const [isHelp, setIsHelp] = useState(post?.reactionMap?.HELPER);
  const [isCute, setIsCute] = useState(post?.reactionMap?.CUTE);
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
  const profileImg = useRef<HTMLImageElement>(null);



  useEffect(() => {
    setCuteCount(post?.reactionCountMap?.CUTE);
    setIsCute(post?.reactionMap?.CUTE);
    setHelpCount(post?.reactionCountMap?.HELPER);
    setIsHelp(post?.reactionMap?.HELPER);
  }, [post]);


  useEffect(() => {
    if (blockUserSuccessToastIsOpen) {
      setTimeout(() => {
        closeBlockUserSuccessToast();
      }, 2000);
    }
  }, [blockUserSuccessToastIsOpen]);

  const { mutate: certificationReactMutate, isLoading: isLoadingCertificationReact } =
    useMutation((data: CertificationReactDataType) => reactCertification(data), {
      onSuccess: () => {
        heartEvent.mutate();
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    });


  const { mutate: certificationDeleteMutate, isLoading: cettificationDeleteIsLoading } =
    useMutation((data: CertificationDeleteDataType) => certificationDelete(data), {
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

  //유저 차단 api 훅
  const { mutate: userBlockMutate, isLoading: userBlockIsLoading } = useMutation(
    (data: UserBlockDataType) => blockUser(data),
    {
      onSuccess: (response: AxiosResponse) => {
        const { code, data } = response.data;
        //차단 성공하면
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
      dispatch(scrollActions.postsScroll({ scroll: window.scrollY, pageSize }));
      navigate(`${RECORD_PATH.PHOTO}/${post.userId}`, {
        state: {
          prevPath: location.pathname,
        },
      });
    }
  };
  const handleReactCertification =
    (reactionCode: string) => (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSignIn) {
        setLoginAlertIsOpen(true);
        return;
      }

      if (reactionCode === reactParam.cute) {
        setIsCute(!isCute);
        setCuteCount(isCute ? cuteCount - 1 : cuteCount + 1);
      } else {
        setIsHelp(!isHelp);
        setHelpCount(isHelp ? helpCount - 1 : helpCount + 1);
      }

      certificationReactMutate({
        userId: user?.id,
        certificationId: post?.certificationId,
        reactionCode,
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

  const moveToMap = () => {
    navigate(ROOT_PATH, {
      state: {
        lat: post.latitude,
        lng: post.longitude,
        categoryCode: post.categoryCode,
        certMungpleId: post.mungpleId !== 0 ? post.mungpleId : undefined,
        cert,
      },
    });
  };
  const cert: Cert = {
    categoryCode: post.categoryCode,
    address: post.address,
    certificationId: post.certificationId,
    description: post.description,
    latitude: post.latitude,
    isLike: post.isLike,
    longitude: post.longitude,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    mungpleId: post.mungpleId,
    photoUrl: post.photoUrl,
    placeName: post.placeName,
    registDt: post.registDt,
    userId: post.userId,
    userName: post.userName,
    photos: post.photos,
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
        imgList: post?.photos,
        title: post?.placeName,
        certificationId: post?.certificationId,
        content: post?.description,
        address: post?.address,
        isHideAddress: post?.isHideAddress,
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
        <div style={{ position: 'relative' }}>
          <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
            {post.photos.map((image: string) => {
              return (
                <SwiperSlide>
                  <img
                    className="post-img-result-main-img"
                    // ref={mainImg}
                    // data-src={image ? image : DogLoading}
                    src={image}
                    width={window.innerWidth}
                    height={window.innerWidth}
                    alt="postImg"
                    aria-hidden="true"
                    onClick={() => openFullScreenSlider && openFullScreenSlider(post?.photos, imageNumber, post?.placeName)}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="absolute bottom-[4px] right-[4px] z-[100] flex h-[23px] w-[55px] items-center justify-center bg-gray-700 bg-opacity-70 text-[11px] font-normal text-white">
            {imageNumber + 1} / {post.photos.length}
          </div>
        </div>
        <header className="post-img-result-main-header">
          <div className="post-img-result-main-header-place">
            <div className="post-img-result-main-header-place-name" onClick={moveToMap}>
              {post?.placeName}
            </div>
            {!post?.isHideAddress && (
              <div className="post-img-result-main-header-place-address">
                {post?.address}
              </div>
            )}
          </div>
        </header>
        {/\n/.test(post?.description) ? (
          <body className="post-img-result-main-body">
            {' '}
            {!moredesc ? post?.description.split('\n')[0] : post?.description}
            {!moredesc ? (
              <span style={{ color: '#AA93EC' }} onClick={() => setMoreDesc(true)}>
                {' '}
                ...더 보기
              </span>
            ) : (
              <div style={{ color: '#AA93EC' }} onClick={() => setMoreDesc(false)}>
                글 접기
              </div>
            )}
          </body>
        ) : post?.description.length > 19 ? (
          <body className="post-img-result-main-body">
            {!moredesc ? post?.description.substring(0, 19) : post?.description}
            {!moredesc ? (
              <span style={{ color: '#AA93EC' }} onClick={() => setMoreDesc(true)}>
                {' '}
                ...더 보기
              </span>
            ) : (
              <div
                style={{ color: '#AA93EC', margin: '15px 0' }}
                onClick={() => setMoreDesc(false)}
              >
                글 접기
              </div>
            )}
          </body>
        ) : (
          <body className="post-img-result-main-body">{post?.description}</body>
        )}

        <body className="post-img-result-main-footer">
          <div
            className={isHelp ? 'post-like-box-active' : 'post-like-box'}
            onClick={handleReactCertification(reactParam.helper)}
          >
            <img src={isHelp ? HelpIcon : DefaultIcon} alt="help-icon" />
            <span>도움돼요</span>
            <span>{helpCount}</span>
          </div>
          <div style={{ marginRight: '9px' }} />
          <div
            className={isCute ? 'post-like-box-active' : 'post-like-box'}
            onClick={handleReactCertification(reactParam.cute)}
          >
            <img src={isCute ? CuteIcon : DefaultIcon} alt="cute-icon" />
            <span>귀여워요</span>
            <span>{cuteCount}</span>
          </div>
        </body>

        <footer className="post-comment-wrapper" onClick={moveToCommentPage}>
          <span>댓글</span>
          <span style={{ color: 'var(--reward-gray-23, #ABABAB)', marginLeft: '3px' }}>
            {post?.commentCount}개
          </span>
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