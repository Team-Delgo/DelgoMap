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
import BackArrowComponent from '../../components/BackArrowComponent';
import DetailInfo from './components/DetailInfo';
import { getDetailPageData } from '../../common/api/detail';
import DetailImageSlider from './components/DetailImageSlider';
import FullScreenImageSlider from './components/FullScreenImageSlider';

function DetailPage() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const [imageNumber, setImageNumber] = useState(1);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const url = useSelector((state: any) => state.map.detailImgUrl);
  const splitUrl = window.location.href.split('/');
  const detailPageId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const { data, isLoading, isError, error } = useQuery(
    ['getDetailPageData', detailPageId],
    () => getDetailPageData(detailPageId),
  );
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

  if (isFullScreenSliderOpen)
    return (
      <FullScreenImageSlider
        close={() => setIsFullScreenSliderOpen(false)}
        images={imageArray}
        index={0}
        placeName={data.placeName}
      />
    );

  return (
    <div className="detail">
      <DetailImageSlider
        openFullSlider={() => setIsFullScreenSliderOpen(true)}
        images={data.photoUrls}
      />
      <DetailHeader
        placeName={data.placeName}
        address={data.address}
        dogFootCount={data.certCount}
        heartCount={14}
        phoneNumber={data.phoneNo}
        openingHours={data.businessHour}
      />
      <DetailInfo
        residentDog={data.residentDogName}
        residentDogPhoto={data.residentDogPhoto}
        instagram={data.instaId}
        representMenu={data.representMenuTitle}
        menuImages={data.representMenuPhotoUrls}
        acceptSize={data.acceptSize}
        isParking={data.isParking}
        enterDsc={data.enterDesc}
        parkingInfo={data.parkingInfo}
        editorNoteUrl={data.editorNoteUrl}
      />
    </div>
  );
}

export default DetailPage;
