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
import DogLoading from '../../../../common/utils/BallLoading';
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

function AchievementPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<achievementType>();
  const [
    achievementBottomSheetIsOpen,
    openAchievementBottomSheet,
    closeAchievementBottomSheet,
  ] = useActive(false);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const swipeArea = useRef<HTMLDivElement>(null);
  const [hammertime, setHammertime] = useState<HammerManager | null>(null);
  
  useEffect(() => {
    if (swipeArea.current) {
      const hammerInstance = new Hammer(swipeArea.current);
      setHammertime(hammerInstance);
    }
    mutation.mutate({
      params: {
        firebase_screen: 'Achievement',
        firebase_screen_class: 'AchievementPage',
      },
    });
  }, []);

  const { isFetching: getMyProfileInfoDataIsLoading, data: myProfileInfoData } = useQuery(
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

  const { isFetching: getAchievementDataListIsLoading, data: achievementDataList } =
    useQuery(GET_ACHIEVEMENT_DATA_LIST, () => getAchievementList(user.id), {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    });

    useEffect(() => {
      if (hammertime) {
        hammertime.on('swiperight', function (e) {
          navigate('/calendar', {state: 'calendar'});
        });
      }
      return () => {
        if (hammertime) {
          hammertime.off('swiperight');
        }
      };
    }, [hammertime]);

  const openBottomSheet = useCallback(
    (achievement: achievementType) => (event: React.MouseEvent) => {
      setSelectedAchievement(achievement);
      setTimeout(() => {
        openAchievementBottomSheet();
      }, 200);
    },
    [],
  );

  // if (getAchievementDataListIsLoading || getMyProfileInfoDataIsLoading) {
  //   return <DogLoading />;
  // }

  return (
    <div
      aria-hidden="true"
      ref={swipeArea}
      onClick={achievementBottomSheetIsOpen ? closeAchievementBottomSheet : undefined}
    >
      <PetInfo myProfileInfoData={myProfileInfoData.data} />
      <Achievment
        achievementList={achievementDataList.data}
        openBottomSheet={openBottomSheet}
      />
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
