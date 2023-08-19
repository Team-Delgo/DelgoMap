import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { getAchievementList } from '../../../../common/api/achievement';
import { RootState } from '../../../../redux/store';
import PetInfo from './PetInfo';
import Achievment from './Achievement';
import { analytics } from '../../../../index';
import AchievementBottomSheet from '../../../../common/dialog/AchievementBottomSheet';
import { achievementType } from '../../../../common/types/achievement';
import useActive from '../../../../common/hooks/useActive';
import './AchieveContainer.scss';
import {
  CACHE_TIME,
  GET_ACHIEVEMENT_DATA_LIST,
  GET_MY_PROFILE_INFO_DATA,
  STALE_TIME,
} from '../../../../common/constants/queryKey.const';
import { useErrorHandlers } from '../../../../common/api/useErrorHandlers';
import { getMyProfileInfo } from '../../../../common/api/myaccount';
import DogLoading from '../../../../common/utils/BallLoading';

function AchievementPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<achievementType>();
  const [
    achievementBottomSheetIsOpen,
    openAchievementBottomSheet,
    closeAchievementBottomSheet,
  ] = useActive(false);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const dispatch = useDispatch();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const swipeArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'Achievement',
        firebase_screen_class: 'AchievementPage',
      },
    });
  }, []);

  const { isLoading: getMyProfileInfoDataIsLoading, data: myProfileInfoData } = useQuery( //프로필 api hook
    GET_MY_PROFILE_INFO_DATA,
    () => getMyProfileInfo(user.id),
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  const { isLoading: getAchievementDataListIsLoading, data: achievementDataList } = //업적 api hook
    useQuery(GET_ACHIEVEMENT_DATA_LIST, () => getAchievementList(user.id), {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    });

  const openBottomSheet = useCallback( //업적바텀시트 open 핸들러
    (achievement: achievementType) => (event: React.MouseEvent) => {
      setSelectedAchievement(achievement);
      setTimeout(() => {
        openAchievementBottomSheet();
      }, 200);
    },
    [],
  );

  const isLoading = getMyProfileInfoDataIsLoading || getAchievementDataListIsLoading;

  return (
    <>
      {isLoading && <DogLoading />}
      <div
        aria-hidden="true"
        ref={swipeArea}
        onClick={achievementBottomSheetIsOpen ? closeAchievementBottomSheet : undefined}
      >
        {myProfileInfoData && <PetInfo myProfileInfoData={myProfileInfoData.data} />}
        {achievementDataList && (
          <Achievment
            achievementList={achievementDataList.data}
            openBottomSheet={openBottomSheet}
          />
        )}
        <AchievementBottomSheet
          text=""
          allView={false}
          achievement={selectedAchievement}
          cancelButtonHandler={closeAchievementBottomSheet}
          bottomSheetIsOpen={achievementBottomSheetIsOpen}
        />
      </div>
    </>
  );
}

export default AchievementPage;
