import React  from 'react';
import { ActivityRatio } from './ActivityRatio';
import { AxiosError } from 'axios';
import { getAccountInfo } from 'common/api/myaccount';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { FrequentPlaces } from './FrequentPlaces';
import './ActivityWrapper.scss';
import { useQuery } from 'react-query';
import { useErrorHandlers } from 'common/api/useErrorHandlers';
import { GET_ACCOUNT_INFO } from 'common/constants/queryKey.const';

export default function ActivityWrapper() {
  const splitUrl = window.location.href.split('/');
  const userId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const dispatch = useDispatch();

  const { data , isLoading } = useQuery([GET_ACCOUNT_INFO, userId], () => getAccountInfo(userId), {
    enabled: !!userId,
    onError: (error:AxiosError) => {
      useErrorHandlers(dispatch,error)
    }
  });

  return (
    <div className='activity-wrapper'>
      <FrequentPlaces places={data?.top3VisitedMungpleList} petName={data?.nickname}/>
      <ActivityRatio counts={data?.activityMapByCategoryCode}/>
    </div>
  );
}
