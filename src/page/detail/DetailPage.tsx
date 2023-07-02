import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import BackArrow from '../common/icons/back-arrow.svg';
import './DetailPage.scss';
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

function DetailPage() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const [imageNumber, setImageNumber] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const url = useSelector((state: any) => state.map.detailImgUrl);
  const splitUrl = window.location.href.split('/');
  const detailPageId = parseInt(splitUrl[splitUrl.length - 1], 10);

  const { data, isLoading, isSuccess } = useQuery(
    ['getDetailPageData', detailPageId],
    () => getDetailPageData(detailPageId),
  );

  const navigateToHome = () => {
    navigate('/');
  };

  console.log(data);

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'DetailPage',
        firebase_screen_class: 'DetailPage',
      },
    });
  }, []);

  if (data === undefined || isLoading) return <BallLoading />;

  const imageArray = [...data.photoUrls, ...data.representMenuPhotoUrls];

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
  console.log(isEditorOpen);
  if (isEditorOpen)
    return <EditorNote image={data.editorNoteUrl} close={() => setIsEditorOpen(false)} />;

  return (
    <div className="detail">
      <BackArrowComponent onClickHandler={navigateToHome} white />
      <DetailImageSlider
        openFullSlider={placeFullScreenHandler}
        images={data.photoUrls}
      />
      <DetailHeader
        placeName={data.placeName}
        address={data.address}
        dogFootCount={data.certCount}
        heartCount={data.recommendCount}
        phoneNumber={data.phoneNo}
        openingHours={data.businessHour}
        categoryCode={data.categoryCode}
      />
      <DetailInfo
        residentDog={data.residentDogName}
        residentDogPhoto={data.residentDogPhoto}
        instagram={data.instaId}
        representMenu={data.representMenuTitle}
        menuImages={data.representMenuPhotoUrls}
        acceptSize={data.acceptSize}
        parkingLimit={data.parkingLimit}
        enterDsc={data.enterDesc}
        parkingInfo={data.parkingInfo}
        editorNoteUrl={data.editorNoteUrl}
        openEditor={() => setIsEditorOpen(true)}
        openFullSlider={menuFullScreenHandler}
        categoryCode={data.categoryCode}
      />
      <DetailReview mungpleId={data.mungpleId} />
    </div>
  );
}

export default DetailPage;
