import React, { useEffect, useRef, useState } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import BallLoading from '../../common/utils/BallLoading';
import { analytics } from '../..';
import DetailHeader from './components/DetailHeader';
import DetailInfo from './components/DetailInfo';
import { getDetailPageData } from '../../common/api/detail';
import DetailImageSlider from './components/DetailImageSlider';
import FullScreenImageSlider from './components/FullScreenImageSlider';
import EditorNote from './components/EditorNote';
import DetailReview from './components/review/DetailReview';
import BackArrowComponent from '../../components/BackArrowComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { SIGN_IN_PATH, UPLOAD_PATH } from 'common/constants/path.const';
import { uploadAction } from 'redux/slice/uploadSlice';
import AlertConfirm from 'common/dialog/AlertConfirm';


function DetailPage() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const [imageNumber, setImageNumber] = useState(1);
  const [showButton, setShowButton] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const splitUrl = window.location.href.split('/');
  const dispatch = useDispatch();

  const detailPageId = parseInt(splitUrl[splitUrl.length - 1], 10);
  ('');
  const { data, isLoading } = useQuery(['getDetailPageData', detailPageId], () =>
    getDetailPageData(detailPageId, userId),
  );

  // const setCertLocation = () => {
  //   if (!isSignIn) {
  //     setIsAlertOpen(true);
  //     return;
  //   }

  //   dispatch(
  //     uploadAction.setHomeCert({
  //       latitude: data.lat,
  //       longitude: data.lng,
  //       mongPlaceId: data?.mungpleId,
  //       title: data?.placeName,
  //       address: data?.address,
  //       categoryCode: data?.categoryCode,
  //     }),
  //   );
  //   navigate(UPLOAD_PATH.CERTIFICATION, {
  //     state: { prevPath: 'detail'  },
  //   });
  // };

  const navigateToHome = () => navigate('/');
  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'DetailPage',
        firebase_screen_class: 'DetailPage',
      },
    });
    const handleScroll = () => {
      if (window.scrollY > 250) {
        // 300px 이상 스크롤하면 버튼을 마운트
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (data === undefined || isLoading) return <BallLoading />;
  let imageArray: string[] = [];
  console.log(data);
  if (data.categoryCode === 'CA0002' || data.categoryCode === 'CA0003') {
    imageArray = [...data.photoUrls, ...data.representMenuPhotoUrls];
  } else if (data.isPriceTag) {
    imageArray = [...data.photoUrls, ...data.priceTagPhotoUrls];
  } else {
    imageArray = [...data.photoUrls];
  }
  const placeFullScreenHandler = (index: number) => {
    setImageNumber(index);
    setIsFullScreenSliderOpen(true);
  };

  const menuFullScreenHandler = (index: number) => {
    setImageNumber(data.photoUrls.length + index);
    setIsFullScreenSliderOpen(true);
  };

  const setCertLocation = () => {
    if (!isSignIn) {
      setIsAlertOpen(true);
      return;
    }

    dispatch(
      uploadAction.setHomeCert({
        latitude: data.latitude,
        longitude: data.longitude,
        mongPlaceId: data.mungpleId,
        title: data.placeName,
        address: data.address,
        categoryCode: data.categoryCode,
      }),
    );
    navigate(UPLOAD_PATH.CERTIFICATION, {
      state: { prevPath: `detail/${data.mungpleId}` },
    });
  };
  const navigateToLoginPage = () => navigate(SIGN_IN_PATH.MAIN);

  if (isFullScreenSliderOpen)
    return (
      <FullScreenImageSlider
        close={() => setIsFullScreenSliderOpen(false)}
        images={imageArray}
        index={imageNumber}
        placeName={data.placeName}
      />
    );

  if (isEditorOpen)
    return <EditorNote image={data.editorNoteUrl} close={() => setIsEditorOpen(false)} />;

  return (
    <div className="overflow-scroll bg-gray-200">
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={navigateToLoginPage}
          noButtonHandler={() => setIsAlertOpen(false)}
        />
      )}
      <BackArrowComponent onClickHandler={navigateToHome} white />
      <DetailImageSlider
        openFullSlider={placeFullScreenHandler}
        images={data.photoUrls}
      />
      <DetailHeader
        placeName={data.placeName}
        address={data.address}
        dogFootCount={data.certCount}
        bookmarkCount={data.bookmarkCount}
        phoneNumber={data.phoneNo}
        openingHours={data.businessHour}
        categoryCode={data.categoryCode}
        isBookmarked={data.isBookmarked}
        mungpleId={data.mungpleId}
      />
      <DetailInfo
        residentDog={data.residentDogName}
        residentDogPhoto={data.residentDogPhoto}
        instagram={data.instaId}
        isPriceTag={data.isPriceTag}
        representMenu={data.representMenuTitle}
        menuImages={
          data.isPriceTag === true ? data.priceTagPhotoUrls : data.representMenuPhotoUrls
        }
        acceptSize={data.acceptSize}
        isParking={data.isParking}
        enterDsc={data.enterDesc}
        parkingInfo={data.parkingInfo}
        editorNoteUrl={data.editorNoteUrl}
        openEditor={() => setIsEditorOpen(true)}
        openFullSlider={menuFullScreenHandler}
        categoryCode={data.categoryCode}
      />
      <DetailReview mungpleId={data.mungpleId} visited={data.certCount} />
      {showButton && (
        <div
          onClick={setCertLocation}
          aria-hidden
          className="fixed bottom-[38px] left-[50%] z-30 w-[92%] translate-x-[-50%] rounded-[12px] bg-[#7a5ccf] py-[16px] text-center text-[16px] font-medium text-white"
        >
          이곳에 기록 남기기
        </div>
      )}
    </div>
  );
}

export default DetailPage;
