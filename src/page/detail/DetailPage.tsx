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

function DetailPage() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const url = useSelector((state: any) => state.map.detailImgUrl);
  const splitUrl = window.location.href.split('/');
  const detailPageId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const { data: detailPageData } = useQuery(['getDetailPageData', detailPageId], () => getDetailPageData(detailPageId))

  console.log(detailPageData);

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
      {/* <DetailHeader /> */}
      {/* <DetailInfo /> */}
    </div>
  );
}

export default DetailPage;
