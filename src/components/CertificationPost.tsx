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
import { weekDay } from '../common/types/week';
import useActive from '../common/hooks/useActive';
import AlertConfirm from '../common/dialog/AlertConfirm';
import { useErrorHandlers } from '../common/api/useErrorHandlers';
import LikeAnimation from '../common/utils/LikeAnimation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

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
  const [moredesc, setMoreDesc] = useState(false);
  const [imageNumber, setImageNumber] = useState(0);
  const [LikeAnimationLoading, setLikeAnimationLoading] = useState(false); //라이크에니메이션 로딩여부(이미지 더블클릭)
  const [likeCount, setLikeCount] = useState(post?.likeCount); //좋아요 갯수
  const [blockedUserName, setBlockedUserName] = useState(''); //차단한 유저이름
  const [isLike, setIsLike] = useState(post?.isLike); //내가 좋아요 눌렀는지 여부
  const [deleteBottomSheetIsOpen, openDeleteBottomSheet, closeDelteBottomSheet] = //삭제 바텀시트 오픈여부 담은 커스텀훅
    useActive(false);
  const [
    deletePostSuccessToastIsOpen,
    openDeletePostSuccessToast,
    closeDeletePostSuccessToast,
  ] = useActive(false); //인증글 삭제후 뜰 Toast 오픈여부 담은 커스텀훅
  const [
    blockUserbottomSheetIsOpen,
    openBlockUserBottomSheet,
    closeBlockUserBottomSheet,
  ] = useActive(false); //차단 바텀시트 오픈여부 담은 커스텀훅
  const [
    blockUserSuccessToastIsOpen,
    openBlockUserSuccessToastIsOpen,
    closeBlockUserSuccessToast,
  ] = useActive(false); //차단 완료후 뜰 Toast 오픈여부 담은 커스텀훅
  const [loginAlertIsOpen, setLoginAlertIsOpen] = useState(false); //로그인 하라고 뜨는 alert창 오픈여부
  const { user, isSignIn } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const heartEvent = useAnalyticsCustomLogEvent(analytics, 'cert_like');
  const commentEvent = useAnalyticsCustomLogEvent(analytics, 'cert_comment_view');
  const mainImg = useRef<HTMLImageElement>(null); //인증이미지 참조하는 useRef훅
  const profileImg = useRef<HTMLImageElement>(null); //프로플이미지 참조하는 useRef훅
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); //Timeout 참조하는 useRef 훅

  // console.log('post', post.photos);

  //이미지가 뷰포트에 나타나면 해당 이미지의 src 속성을 데이터 속성에서 가져와 설정
  //default img를 보여주고있다가 obeserver에 의해 관찰되면 그떄 이미지 dataset src속성을 해당 요소 src에 설정해줌
  //즉 뷰포트에 이미지가 감지될떄 해당 이미지를 load하기 위한 설정(image lazy loading)
  // const observeImg = (
  //   entries: IntersectionObserverEntry[], // 감지된 요소의 정보를 제공하는 배열
  //   observer: IntersectionObserver, // 해당 IntersectionObserver 인스턴스
  // ) => {
  //   entries.forEach((entry: any) => {
  //     //감지된요소를 반복문으로 돌며
  //     if (entry.isIntersecting) {
  //       // 해당 요소가 뷰포트와 교차하는 경우
  //       entry.target.src = entry.target.dataset.src; // 이미지의 src 속성을 데이터 속성에서 가져와 설정
  //       observer.unobserve(entry.target); // 이미지가 로드되면 더 이상 관찰할 필요가 없으므로 관찰을 중단
  //     }
  //   });
  // };

  // //해당 컴포넌트가 마운트될 때 IntersectionObserver를 생성하고 이미지들을 관찰
  // useEffect(() => {
  //   const observer = new IntersectionObserver(observeImg); //IntersectionObserver를 생성
  //   mainImg.current && observer.observe(mainImg.current); // mainImg가 존재하면 관찰을 시작
  //   profileImg.current && observer.observe(profileImg.current); // profileImg가 존재하면 관찰을 시작
  // }, [post]);

  //post props값이 변경되면 좋아요여부와 갯수를 갱신해줌(stale -> fresh)
  useEffect(() => {
    setLikeCount(post?.likeCount);
    setIsLike(post?.isLike);
  }, [post]);

  // blockUserSuccessToastIsOpen true되면 2초후 false로 변환해줌
  useEffect(() => {
    if (blockUserSuccessToastIsOpen) {
      setTimeout(() => {
        closeBlockUserSuccessToast();
      }, 2000);
    }
  }, [blockUserSuccessToastIsOpen]);

  //좋아요 api 훅
  const { mutate: certificationLikeMutate, isLoading: isLoadingCertificationLike } =
    useMutation((data: CertificationLIkeDataType) => certificationLike(data), {
      onSuccess: () => {
        heartEvent.mutate();
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    });

  //인증글 삭제 api 훅
  const { mutate: certificationDeleteMutate, isLoading: cettificationDeleteIsLoading } =
    useMutation((data: CertificationLIkeDataType) => certificationDelete(data), {
      onSuccess: (response: AxiosResponse) => {
        const { code } = response.data;
        if (code === 200) {
          //성공하면 삭제바텀시트 닫고, 삭제toast 열고, 인증 리스트 api refetch 해줌(stale -> fresh)
          closeDelteBottomSheet();
          openDeletePostSuccessToast();
          certificationPostsFetch();
          setTimeout(() => {
            closeDeletePostSuccessToast(); //2초후 삭제toast 닫아줌
          }, 2000);
        } else {
          closeDelteBottomSheet(); //성공못해도 바텀시트 닫아줌
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
          setBlockedUserName(data?.name); //차단한 유저이름 상태값 바꿔주고(toast 메시지로 띄워야함) 상
          openBlockUserSuccessToastIsOpen(); //유저차단 toast 열어줌
          closeBlockUserBottomSheet(); //차단 바텀시트 닫아줌
          certificationPostsFetch(); //인증 리스트 api refetch 해줌(stale -> fresh)
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
    //로그인 안되있으면 로그인alert창 띄워주고
    if (!isSignIn) {
      setLoginAlertIsOpen(true);
      return;
    }
    //좋아요갯수, 좋아요여부 갱신
    setLikeCount(isLike ? likeCount - 1 : likeCount + 1);
    if (isLike) setIsLike(false);
    else setIsLike(true);

    certificationLikeMutate({
      userId: user?.id,
      certificationId: post?.certificationId,
    });
  };

  //인증삭제 핸들러
  const handleCertificationDelete = () => {
    if (userBlockIsLoading) return;
    certificationDeleteMutate({
      userId: user?.id,
      certificationId: post?.certificationId,
    });
  };

  //유저차단 핸들러
  const handleUserBlock = () => {
    if (cettificationDeleteIsLoading) return;
    userBlockMutate({
      myUserId: user?.id,
      blockedUserId: post?.userId,
    });
  };

  const moveToCommentPage = () => {
    //로그인 안되있으면 로그인alert창 띄워주고
    if (!isSignIn) {
      setLoginAlertIsOpen(true);
      return;
    }
    commentEvent.mutate();
    //현재 스크롤y,페이지사이즈 store에 저장해줌 (되돌아왔을때 스크롤 유지를 )위해
    dispatch(scrollActions.postsScroll({ scroll: window.scrollY, pageSize }));
    navigate(`/comments/${post?.certificationId}`, {
      state: { post },
    });
  };

  const moveToUpdatePage = () => {
    //현재 스크롤y,페이지사이즈 store에 저장해줌 (되돌아왔을때 스크롤 유지를 )위해
    dispatch(scrollActions.postsScroll({ scroll: window.scrollY, pageSize }));
    //업데이트페이지에서 필요한 post관련 상태값 store에 저장
    dispatch(
      uploadAction.setCertificationUpdate({
        imgList: post?.photos,
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
  const placeClickHandler = () => {
    navigate(ROOT_PATH, {
      state: {
        certId: post.certificationId,
        certAddress: post.address,
        isMungple: post.mungpleId,
      },
    });
  };
  const closeAlert = () => {
    setLoginAlertIsOpen(false);
  };

  const sendLoginPage = () => {
    navigate(SIGN_IN_PATH.MAIN);
  };

  console.log(post?.description);
  console.log(post?.description.length);

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
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="absolute bottom-[4px] right-[4px] z-[100] flex h-[23px] w-[55px] items-center justify-center bg-gray-700 bg-opacity-70 text-[11px] font-normal text-white">
            {imageNumber + 1} / {post.photos.length}
          </div>
        </div>
        {LikeAnimationLoading && (
          <div className="like-animation-wrapper" style={{ height: window.innerWidth }}>
            <LikeAnimation isLike={isLike} />
          </div>
        )}
        <header className="post-img-result-main-header">
          <div className="post-img-result-main-header-place">
            <div
              className="post-img-result-main-header-place-name"
              onClick={placeClickHandler}
            >
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
