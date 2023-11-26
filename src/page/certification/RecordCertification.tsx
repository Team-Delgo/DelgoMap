import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useErrorHandlers } from '../../common/api/useErrorHandlers';
import VerticalDevider from '../../common/icons/vertical-devide.svg';
import Heart from '../../common/icons/heart-empty.svg';
import FillHeart from '../../common/icons/heart.svg';
import Comments from '../../common/icons/comments.svg';
import { Cert } from '../../common/types/map';
import './RecordCertification.scss';
import { certificationDelete, reactCertification } from '../../common/api/certification';
import { uploadAction } from '../../redux/slice/uploadSlice';
import {
  ROOT_PATH,
  UPLOAD_PATH,
  RECORD_PATH,
  SIGN_IN_PATH,
} from '../../common/constants/path.const';
import { RootState } from '../../redux/store';
import DeleteBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import { categoryCode2 } from '../../common/types/category';
import useActive from '../../common/hooks/useActive';
import AlertConfirm from '../../common/dialog/AlertConfirm';
import LikeAnimation from '../../common/utils/LikeAnimation';
import { postType } from '../../common/types/post';
import { reactParam } from '../../common/constants/parameter.const';
import CuteIcon from '../../common/icons/react-cute.svg';
import HelpIcon from '../../common/icons/react-help.svg';
import DefaultIcon from '../../common/icons/react-default.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface CertificationReactDataType {
  userId: number;
  certificationId: number;
  reactionCode: string;
}
interface CertificationDeleteDataType {
  userId: number;
  certificationId: number;
}
function RecordCertification(props: { certification: any }) {
  const [loginAlertIsOpen, setLoginAlertIsOpen] = useState(false); //로그인 하라고 뜨는 alert창 오픈여부
  const [imageNumber, setImageNumber] = useState(0);
  const { certification } = props;
  const dispatch = useDispatch();
  const [helpCount, setHelpCount] = useState(certification?.reactionCountMap?.HELPER);
  const [cuteCount, setCuteCount] = useState(certification?.reactionCountMap?.CUTE);
  const [isHelp, setIsHelp] = useState(certification?.reactionMap?.HELPER);
  const [isCute, setIsCute] = useState(certification?.reactionMap?.CUTE);
  const [deleteBottomSheetIsOpen, openDeleteBottomSheet, closeDeleteBottomSheet] =
    useActive(false); //삭제텍스트 클릭시 열리는 바텀시트 오픈여부를 담은 커스텀훅
  const navigate = useNavigate();
  const { user, isSignIn } = useSelector((state: RootState) => state.persist.user);

  const queryClient = useQueryClient();

  const { mutate: certificationReactMutate, isLoading: isLoadingCertificationReact } =
    useMutation((data: CertificationReactDataType) => reactCertification(data), {
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    });

  // post삭제 api 훅
  const { mutate: certificationDeleteMutate, isLoading: cettificationDeleteIsLoading } =
    useMutation((data: CertificationDeleteDataType) => certificationDelete(data), {
      onSuccess: (response: any) => {
        const { code } = response.data;

        if (code === 200) {
          //삭제를 성공했으면 photo 페이지로 이동
          queryClient.invalidateQueries(['getCertPhotos', user.id]);
          queryClient.removeQueries(['getCertPhotos', user.id]);
          queryClient.refetchQueries(['getCertPhotos', user.id]);
          moveToPhotoPage();
        }
      },
      onError: (error: any, variables, context) => {
        useErrorHandlers(dispatch, error);
      },
    });

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
        certificationId: certification?.certificationId,
        reactionCode,
      });
    };
  //post 삭제 핸들러
  const deleteCertification = () => {
    if (cettificationDeleteIsLoading) {
      return;
    }
    closeDeleteBottomSheet();
    certificationDeleteMutate({
      userId: user?.id,
      certificationId: certification.certificationId,
    });
  };
  const cert: Cert = certification;
  const moveToMap = () => {
    navigate(ROOT_PATH, {
      state: {
        lat: certification.latitude,
        lng: certification.longitude,
        categoryCode: certification.categoryCode,
        certMungpleId:
          certification.mungpleId !== 0 ? certification.mungpleId : undefined,
        cert,
      },
    });
  };

  const moveToCommentPage = () => {
    if (!isSignIn) {
      setLoginAlertIsOpen(true);
      return;
    }
    navigate(`/comments/${certification.certificationId}`, {
      state: { post: certification },
    });
  };

  const moveToPhotoPage = () => {
    navigate(`${RECORD_PATH.PHOTO}/${user.id}`);
  };

  //업데이트 페이지 이동 핸들러
  const moveToUpdatePage = () => {
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
  };

  return (
    <>
      <div className="record-cert">
        {certification.userId === user.id && (
          <div className="record-cert-edit">
            <div aria-hidden="true" onClick={moveToUpdatePage}>
              수정
            </div>
            <img src={VerticalDevider} alt="devider" />
            <div aria-hidden="true" onClick={openDeleteBottomSheet}>
              삭제
            </div>
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
            {certification.photos.map((image: string) => {
              return (
                <SwiperSlide>
                  <img
                    className="record-cert-img"
                    src={image}
                    alt={certification.placeName}
                    aria-hidden="true"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="absolute bottom-[4px] right-[4px] z-[100] flex h-[23px] w-[55px] items-center justify-center bg-gray-700 bg-opacity-70 text-[11px] font-normal text-white">
            {imageNumber + 1} / {certification.photos.length}
          </div>
        </div>
        <div className="record-cert-main">
          <div className="record-cert-main-text">
            <div className="record-cert-main-text-title" onClick={moveToMap}>
              {certification.placeName}
            </div>
            <div className="record-cert-main-text-sub">{certification.address}</div>
          </div>
        </div>
        <div className="record-cert-devider" />
        <div className="record-cert-description">{certification.description}</div>
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
            {certification?.commentCount}개
          </span>
        </footer>
        {/* <div className="record-cert-icons">
          <img
            className="record-cert-icons-heart"
            width={22}
            height={22}
            src={selfHeart ? FillHeart : Heart}
            alt="heart"
            aria-hidden="true"
            onClick={likeCertification}
          />
          {count > 0 && <div className="record-cert-icons-count">{count}</div>}
          <img
            className="record-cert-icons-comments"
            src={Comments}
            alt="comments"
            aria-hidden="true"
            onClick={moveToCommentPage}
          />
          {certification.commentCount > 0 && (
            <div className="record-cert-icons-count">{certification.commentCount}</div>
          )}
        </div> */}
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
      {loginAlertIsOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={() => navigate(SIGN_IN_PATH.MAIN)}
          noButtonHandler={() => setLoginAlertIsOpen(false)}
        />
      )}
    </>
  );
}

export default RecordCertification;
