import React, { useEffect, useState } from 'react';
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
import DetailCertButton from './components/DetailCertButton';
import { uploadAction } from 'redux/slice/uploadSlice';
import { UPLOAD_PATH } from 'common/constants/path.const';

function DetailPage() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const [imageNumber, setImageNumber] = useState(1);
  const [isButtonRendering, setIsButtonRendering] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const splitUrl = window.location.href.split('/');
  const detailPageId = parseInt(splitUrl[splitUrl.length - 1], 10);
  ('');
  const { data, isLoading } = useQuery(['getDetailPageData', detailPageId], () =>
    getDetailPageData(detailPageId, userId),
  );
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isButtonRendering) {
        // 예: 100px 이상 스크롤됐을 때
        setIsButtonRendering(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [data]);
  const navigateToHome = () => navigate('/');
  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'DetailPage',
        firebase_screen_class: 'DetailPage',
      },
    });
  }, []);

  const dispatch = useDispatch();

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

  const buttonClickHandler = () => {
    dispatch(
      uploadAction.setMongPlace({
        title: data.placeName,
        mongPlaceId: data.mungpleId,
        address: data.address,
      }),
    );
    navigate(UPLOAD_PATH.CERTIFICATION, {
      state: { prevPath: 'detail' },
    });
  };

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
      <BackArrowComponent onClickHandler={navigateToHome} white />
      <DetailImageSlider
        openFullSlider={placeFullScreenHandler}
        images={data.photoUrls}
      />
      <DetailHeader
        placeName={data.placeName}
        address={data.address}
        dogFootCount={data.certCount}
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
      <DetailReview
        mungpleId={data.mungpleId}
        visited={data.certCount}
        heart={data.recommendCount}
      />
      <div className="bg-white pb-[70px]" />
      {isButtonRendering && <DetailCertButton onClick={buttonClickHandler} />}
    </div>
  );
}

export default DetailPage;
