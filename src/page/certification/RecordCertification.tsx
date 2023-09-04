import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useErrorHandlers } from '../../common/api/useErrorHandlers';
import VerticalDevider from '../../common/icons/vertical-devide.svg';
import Heart from '../../common/icons/heart-empty.svg';
import FillHeart from '../../common/icons/heart.svg';
import Comments from '../../common/icons/comments.svg';
import { Cert } from '../../common/types/map';
import './RecordCertification.scss';
import { certificationLike, certificationDelete } from '../../common/api/certification';
import { uploadAction } from '../../redux/slice/uploadSlice';
import { UPLOAD_PATH, RECORD_PATH } from '../../common/constants/path.const';
import { RootState } from '../../redux/store';
import DeleteBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import { categoryCode2 } from '../../common/types/category';
import useActive from '../../common/hooks/useActive';
import LikeAnimation from '../../common/utils/LikeAnimation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface CertificationLIkeDataType {
  userId: number;
  certificationId: number;
}

function RecordCertification(props: { certification: any }) {
  const [imageNumber, setImageNumber] = useState(0);
  const { certification } = props;
  const dispatch = useDispatch();
  const [clickCount, setClickCount] = useState(0); //이미지 더블클릭시 좋아요 여부를 처리하기 위해 선언
  const [LikeAnimationLoading, setLikeAnimationLoading] = useState(false); //라이크에니메이션 로딩여부(이미지 더블클릭)
  const [selfHeart, setSelfHeart] = useState(certification.isLike); //본인이 좋아요 눌렀는지 여부
  const [count, setCount] = useState(certification.likeCount); //좋아요 갯수
  const [deleteBottomSheetIsOpen, openDeleteBottomSheet, closeDeleteBottomSheet] =
    useActive(false); //삭제텍스트 클릭시 열리는 바텀시트 오픈여부를 담은 커스텀훅
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.persist.user);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); //Timeout 참조하는 useRef 훅

  console.log('certification', certification);

  //좋아요 api 훅
  const { mutate: certificationLikeMutate } = useMutation(
    (data: CertificationLIkeDataType) => certificationLike(data),
    {
      onSuccess: () => {
        //성공하면 본인이 좋아요 여부를 바꿔주고 (좋아요 -> 좋아요취소 // 좋아요취소 -> 좋아요)
        //좋아요 갯수도 바꿔줌(좋아요 -> 갯수 늘리기 // 좋아요 취소 -> 갯수 줄이기)
        setSelfHeart(!selfHeart);
        setCount(selfHeart ? count - 1 : count + 1);
      },
      onError: (error: any, variables, context) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  // post삭제 api 훅
  const { mutate: certificationDeleteMutate, isLoading: cettificationDeleteIsLoading } =
    useMutation((data: CertificationLIkeDataType) => certificationDelete(data), {
      onSuccess: (response: any) => {
        const { code } = response.data;

        if (code === 200) {
          //삭제를 성공했으면 photo 페이지로 이동
          moveToPhotoPage();
        }
      },
      onError: (error: any, variables, context) => {
        useErrorHandlers(dispatch, error);
      },
    });

  //post 삭제 핸들러
  const deleteCertification = useCallback(() => {
    if (cettificationDeleteIsLoading) {
      return;
    }
    closeDeleteBottomSheet();
    certificationDeleteMutate({
      userId: user?.id,
      certificationId: certification.certificationId,
    });
  }, []);

  const moveToPhotoPage = useCallback(() => {
    navigate(`${RECORD_PATH.PHOTO}/${user.id}`);
  }, []);

  //업데이트 페이지 이동 핸들러
  const moveToUpdatePage = useCallback(() => {
    //업데이트 페이지 이동시 화면을 보여주기위해 현재 인증글을 store에 저장해줌(업데이트 페이지에서 필요한 상태값을 저장해주면 됨)
    dispatch(
      uploadAction.setCertificationUpdate({
        imgList: certification?.photos,
        categoryKo: categoryCode2[certification?.categoryCode],
        title: certification?.placeName,
        certificationId: certification?.certificationId,
        content: certification?.description,
        address: certification?.address,
        isHideAddress: certification?.isHideAddress,
      }),
    );
    //업데이트 페이지 이동하고, 현재 페이지(prevPath)를 저장해줌 (업데이트페이지에서 prevPath에 따라 분기처리해줘하는 로직이 존재하기 때문)
    navigate(UPLOAD_PATH.UPDATE, {
      state: {
        prevPath: RECORD_PATH.PHOTO,
      },
    });
  }, []);

  //포스트 더블클릭 핸들러
  const handleDoubleClick = () => {
    // 이미 setTimeout이 설정되어 있다면 그것을 clear (연속적인 클릭을 대비)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 이전 클릭 카운트를 기반으로 새로운 클릭 카운트를 설정
    setClickCount((prevCount: number) => {
      const newCount = prevCount + 1;
      // 클릭 카운트가 2이면 (더블클릭)
      if (newCount === 2) {
        // 좋아요 애니메이션 로딩 시작
        setLikeAnimationLoading(true);
        // 좋아요 API 호출
        certificationLikeMutate({
          userId: certification.userId,
          certificationId: certification.certificationId,
        });
        // 1초 후 클릭 카운트를 0으로 리셋 (더블클릭 감지를 초기화)
        timeoutRef.current = setTimeout(() => setClickCount(0), 1000);
        // 0.5초 후 애니메이션 로딩 상태를 false로 변경
        setTimeout(() => setLikeAnimationLoading(false), 500);
      } else {
        // 더블클릭이 아니면 1초 후 클릭 카운트만 0으로 리셋
        timeoutRef.current = setTimeout(() => setClickCount(0), 1000);
      }
      return newCount; // 새로운 클릭 카운트 반환
    });
  };

  return (
    <>
      <div className="record-cert">
        <div className="record-cert-edit">
          <div aria-hidden="true" onClick={moveToUpdatePage}>
            수정
          </div>
          <img src={VerticalDevider} alt="devider" />
          <div aria-hidden="true" onClick={openDeleteBottomSheet}>
            삭제
          </div>
        </div>
        <>
          <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
            {certification.photos.map((image: string) => {
              return (
                <SwiperSlide>
                  <img
                    className="record-cert-img"
                    src={image}
                    alt={certification.placeName}
                    aria-hidden="true"
                    onClick={handleDoubleClick}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          {/* <div className="absolute bottom-[5px] right-0 z-[100] flex h-[23px] w-[55px] items-center justify-center bg-gray-700 bg-opacity-70 text-[11px] font-normal text-white ">
            {imageNumber + 1} / {certification.photos.length}
          </div> */}
        </>
        {LikeAnimationLoading && (
          <div className="like-animation-wrapper" style={{ height: window.innerWidth }}>
            <LikeAnimation isLike={selfHeart} />
          </div>
        )}
        <div className="record-cert-main">
          <div className="record-cert-main-text">
            <div className="record-cert-main-text-title">{certification.placeName}</div>
            <div className="record-cert-main-text-sub">{certification.address}</div>
          </div>
        </div>
        <div className="record-cert-devider" />
        <div className="record-cert-description">{certification.description}</div>
        <div className="record-cert-icons">
          <img
            className="record-cert-icons-heart"
            width={22}
            height={22}
            src={selfHeart ? FillHeart : Heart}
            alt="heart"
            aria-hidden="true"
            onClick={() =>
              certificationLikeMutate({
                userId: certification.userId,
                certificationId: certification.certificationId,
              })
            }
          />
          {count > 0 && <div className="record-cert-icons-count">{count}</div>}
          <img
            className="record-cert-icons-comments"
            src={Comments}
            alt="comments"
            aria-hidden="true"
            onClick={() => {
              navigate(`/comments/${certification.certificationId}`, {
                state: { post: certification },
              });
            }}
          />
          {certification.commentCount > 0 && (
            <div className="record-cert-icons-count">{certification.commentCount}</div>
          )}
        </div>
      </div>
      <DeleteBottomSheet
        text="기록을 삭제하실건가요?"
        description="지우면 다시 볼 수 없어요"
        cancelText="취소"
        acceptText="삭제"
        acceptButtonHandler={deleteCertification}
        cancelButtonHandler={closeDeleteBottomSheet}
        bottomSheetIsOpen={deleteBottomSheetIsOpen}
      />
    </>
  );
}

export default RecordCertification;
