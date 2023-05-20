import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../common/icons/back-arrow.svg';
import './DetailPage.scss';
import BallLoading from '../common/utils/BallLoading';
import { analytics } from '..';
import BackArrowComponent from '../components/BackArrowComponent';

function ImageBox({ children }: PropsWithChildren<unknown>) {
  return (
    <div
      style={{
        display: 'block',
        width: '90%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
}

function DetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [imgLoading, setImageLoading] = useState(true);
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const url = useSelector((state: any) => state.map.detailImgUrl);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    mutation.mutate({
      params: {
        firebase_screen: 'DetailPage',
        firebase_screen_class: 'DetailPage',
      },
    });
  }, []);

  return (
    <div className="detail">
      {(true) && <BallLoading />}
      <BackArrowComponent isFixed onClickHandler={() => navigate(-1)} />

      <img
        className="detail-img"
        src={url}
        alt="url"
        onLoad={() => setImageLoading(false)}
      />
    </div>
  );
}

export default DetailPage;
