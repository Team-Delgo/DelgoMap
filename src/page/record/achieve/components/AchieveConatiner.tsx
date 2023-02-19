import React, { useEffect, useState, useCallback } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { getAchievementList } from '../../../../common/api/achievement';
import { RootState } from '../../../../redux/store';
import PetInfo from './PetInfo';
import Achievment from './Achievement';
import { analytics } from '../../../../index';
import Loading from '../../../../common/utils/Loading';
import AchievementBottomSheet from '../../../../common/dialog/AchievementBottomSheet';
import { achievementType } from '../../../../common/types/achievement';
import useActive from '../../../../common/hooks/useActive';
import './AchieveConatiner.scss';
import { CACHE_TIME, GET_ACHIEVEMENT_DATA_LIST, STALE_TIME } from '../../../../common/constants/queryKey.const';
import { useErrorHandlers } from '../../../../common/api/useErrorHandlers';

function AchievementPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<achievementType>();
  const [achievementBottomSheetIsOpen, openAchievementBottomSheet, closeAchievementBottomSheet] = useActive(false);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const dispatch = useDispatch();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'Achievement',
        firebase_screen_class: 'AchievementPage',
      },
    });
  }, []);

  const { isLoading: getAchievemntListIsLoading, data: achievementDataList } = useQuery(
    GET_ACHIEVEMENT_DATA_LIST,
    () => getAchievementList(user.id),
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  console.log('achievementDataList', achievementDataList);

  const openBottomSheet = useCallback(
    (achievement: achievementType) => (event: React.MouseEvent) => {
      setSelectedAchievement(achievement);
      setTimeout(() => {
        openAchievementBottomSheet();
      }, 200);
    },
    [],
  );

  if (getAchievemntListIsLoading) {
    return <Loading />;
  }

  return (
    <div aria-hidden="true" onClick={achievementBottomSheetIsOpen ? closeAchievementBottomSheet : undefined}>
      <PetInfo />
      <Achievment achievementList={achievementDataList.data} openBottomSheet={openBottomSheet} />
      <AchievementBottomSheet
        text=""
        allView={false}
        achievement={selectedAchievement}
        cancelButtonHandler={closeAchievementBottomSheet}
        bottomSheetIsOpen={achievementBottomSheetIsOpen}
      />
    </div>
  );
}

export default AchievementPage;
