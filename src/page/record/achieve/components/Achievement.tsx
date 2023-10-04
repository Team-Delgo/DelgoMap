import React from 'react';
import { achievementType } from '../../../../common/types/achievement';
import { getMyProfileInfo, getOtherProfileInfo } from '../../../../common/api/myaccount';
import AchievementData from './AchievementData';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useQuery } from 'react-query';

interface achievementPropsType {
  achievementList: Array<achievementType>;
  openBottomSheet: (param: achievementType) => (event: React.MouseEvent) => void;
}

//업적리스트 컴포넌트(지금은 1개이나 원래 여러개였음 -> 나중에 추가될 수 있음)

function Achievement({ achievementList, openBottomSheet }: achievementPropsType) {
  const myId = useSelector((state: RootState) => state.persist.user.user.id);
  const splitUrl = window.location.href.split('/');
  const userId = parseInt(splitUrl[splitUrl.length - 1], 10);

  let isMyAccount = false;
  if (userId === myId) isMyAccount = true;
  else isMyAccount = false;

  const { data, isLoading } = useQuery(['getPetdata', userId], () => {
    if (isMyAccount) return getMyProfileInfo(userId);
    else return getOtherProfileInfo(userId);
  });

  const activeAchievementList = achievementList.filter(
    (element: achievementType) => element.isActive === true,  //isActive 가 true이면 획득한 업적
  );

  return (
    <body className="achievement-page-body">
      <div className="achievement-page-body-achievements-title">{data?.nickname}의 업적</div>
      <div className="achievement-page-body-achievements-count">
        총 {activeAchievementList.length}개 획득
      </div>
      <div className="achievement-page-body-achievements-images">
        {achievementList
          .sort((a: achievementType, b: achievementType) =>
            a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1,
          )
          .map((achievement: achievementType) => (
            <AchievementData
              achievement={achievement}
              openBottomSheet={openBottomSheet}
            />
          ))}
      </div>
    </body>
  );
}

export default Achievement;
