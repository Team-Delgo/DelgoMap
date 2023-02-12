import React, { useEffect, useState, useCallback } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAchievementList } from '../../common/api/achievement';
import { RootState } from '../../redux/store';
import PetInfo from './components/PetInfo';
import Achievment from './components/Achievement';
import { analytics } from '../../index';
import Loading from '../../common/utils/Loading';
import ToastPurpleMessage from '../../common/dialog/ToastPurpleMessage';
import AchievementBottomSheet from '../../common/dialog/AchievementBottomSheet';
import { achievementType } from '../../common/types/achievement';
import useActive from '../../common/hooks/useActive';
import './AchievementPage.scss';

function AchievementPage() {
  const [achievementList, setAchievementList] = useState<achievementType[]>([]);
  const [mainAchievementList, setMainAchievementList] = useState<achievementType[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<achievementType>();
  const [mainAchievementSuccessToastIsOpen, openMainAchievementSuccessToast, closeMainAchievementSuccessToast] = useActive(false);
  const [mainAchievementLimitToastIsOpen, oepnMainAchievementLimitToast, closeMainAchievementLimitToast] = useActive(false);
  const [editActivation, onEditActivation, offEditActivation] = useActive(false);
  const [achievementBottomSheetIsOpen, openAchievementBottomSheet, closeAchievementBottomSheet] = useActive(false);
  const [isLoading, oepnLoading, closeLoading] = useActive(true);
  const [achievementListCount, setAchievementListCount] = useState(0);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const dispatch = useDispatch();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  useEffect(() => {
    getgetAchievementDataList();
    mutation.mutate({
      params: {
        firebase_screen: 'Achievement',
        firebase_screen_class: 'AchievementPage',
      },
    });
  }, []);

  useEffect(() => {
    if (mainAchievementSuccessToastIsOpen) {
      setTimeout(() => {
        closeMainAchievementSuccessToast();
      }, 2000);
    }
  }, [mainAchievementSuccessToastIsOpen]);

  useEffect(() => {
    if (mainAchievementLimitToastIsOpen) {
      setTimeout(() => {
        closeMainAchievementLimitToast();
      }, 2000);
    }
  }, [mainAchievementLimitToastIsOpen]);

  const getgetAchievementDataList = () => {
    oepnLoading();
    getAchievementList(
      user.id,
      (response: AxiosResponse) => {
        const { data } = response.data;

        console.log('data',data)

        const activeAchievementList = data.filter((element: achievementType) => element.isActive === true);
        setAchievementListCount(activeAchievementList.length);

        const achievementList = data.filter((element: achievementType) => element.isMain === 0);
        setAchievementList(achievementList);

        const mainAchievementList = data.filter((element: achievementType) => element.isMain > 0);
        setMainAchievementList(mainAchievementList);
      },
      dispatch,
    );
    setTimeout(() => {
      closeLoading();
    }, 100);
  };

  const selectRepresentativeAchievements = (achievement: achievementType) => (event: React.MouseEvent) => {
    if (mainAchievementList.length < 3) {
      setTimeout(() => {
        const newAchievementList = achievementList.filter((element: achievementType) => element !== achievement);
        setMainAchievementList([...mainAchievementList, achievement]);
        setAchievementList(newAchievementList);
      }, 300);
    } else {
      oepnMainAchievementLimitToast();
    }
  };

  const openBottomSheet = useCallback(
    (achievement: achievementType) => (event: React.MouseEvent) => {
      setSelectedAchievement(achievement);
      setTimeout(() => {
        openAchievementBottomSheet();
      }, 200);
    },
    [],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div aria-hidden="true" onClick={achievementBottomSheetIsOpen ? closeAchievementBottomSheet : undefined}>
      <PetInfo/>
      <Achievment
        editActivation={editActivation}
        achievementList={achievementList}
        achievementListCount={achievementListCount}
        selectRepresentativeAchievements={selectRepresentativeAchievements}
        openBottomSheet={openBottomSheet}
      />
      <AchievementBottomSheet
        text=""
        allView={false}
        achievement={selectedAchievement}
        cancelButtonHandler={closeAchievementBottomSheet}
        bottomSheetIsOpen={achievementBottomSheetIsOpen}
      />
      {mainAchievementSuccessToastIsOpen && <ToastPurpleMessage message="대표업적 설정이 성공했습니다." />}
      {mainAchievementLimitToastIsOpen && <ToastPurpleMessage message="업적 최대 3개까지만 설정 가능합니다." />}
    </div>
  );
}

export default AchievementPage;
