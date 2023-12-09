import React  from 'react';
import { ActivityRatio } from './ActivityRatio';
import { AxiosError } from 'axios';
import { getMyInfo } from 'common/api/myaccount';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { FrequentPlaces } from './FrequentPlaces';
import './ActivityWrapper.scss';
import { useQuery } from 'react-query';
import { useErrorHandlers } from 'common/api/useErrorHandlers';
import { GET_MY_USER_INFO } from 'common/constants/queryKey.const';

export default function ActivityWrapper() {
  const { user } = useSelector((state: RootState) => state.persist.user);
  const dispatch = useDispatch();

  const { data , isLoading } = useQuery([GET_MY_USER_INFO, user.id], () => getMyInfo(user.id), {
    enabled: !!user.id,
    onError: (error:AxiosError) => {
      useErrorHandlers(dispatch,error)
    },
    onSuccess: (data:any) => {
      console.log('data',data)
    }

  });

  return (
    <div className='activity-wrapper'>
      <FrequentPlaces places={data?.data?.top3VisitedMungpleList}/>
      <ActivityRatio counts={data?.data?.activityMapByCategoryCode}/>
    </div>
  );
}
