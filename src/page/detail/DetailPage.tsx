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
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

function DetailPage() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const [imageNumber, setImageNumber] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const splitUrl = window.location.href.split('/');
  const detailPageId = parseInt(splitUrl[splitUrl.length - 1], 10);
  ('');
  const { data, isLoading } = useQuery(['getDetailPageData', detailPageId], () =>
    getDetailPageData(detailPageId, userId),
  );
  const navigateToHome = () => navigate('/');
  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'DetailPage',
        firebase_screen_class: 'DetailPage',
      },
    });
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
    <div className="overflow-scroll bg-gray-200" >
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
      <DetailReview
        mungpleId={data.mungpleId}
        visited={data.certCount}
      />
      <div
        aria-hidden
        className="fixed bottom-[38px] left-[50%] z-30 w-[92%] translate-x-[-50%] rounded-[12px] bg-[#7a5ccf] py-[18px] text-center text-[16px] font-medium text-white"
      >
        이곳에 기록 남기기
      </div>
    </div>
  );
}

export default DetailPage;
