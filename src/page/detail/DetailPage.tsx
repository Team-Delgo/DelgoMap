import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../common/icons/back-arrow.svg';
import './DetailPage.scss';
import BallLoading from '../../common/utils/BallLoading';
import { analytics } from '../..';
import DetailHeader from './components/DetailHeader';
import BackArrowComponent from '../../components/BackArrowComponent';
import DetailInfo from './components/DetailInfo';

function DetailPage() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const url = useSelector((state: any) => state.map.detailImgUrl);

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'DetailPage',
        firebase_screen_class: 'DetailPage',
      },
    });
  }, []);

  return (
    <div className="detail">
      <div className="detail-img">
        <img src="https://newsimg.sedaily.com/2021/12/12/22V9KRDG8B_9.jpeg" alt="detail" />
        <div className="detail-img-number">{2}/4</div>
      </div>
      <DetailHeader />
      <DetailInfo />
    </div>
  );
}

export default DetailPage;
