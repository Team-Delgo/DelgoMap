import React from 'react';
import { achievementType } from '../../../../common/types/achievement';
import AchievementData from './AchievementData';

interface achievementPropsType {
  achievementList: Array<achievementType>;
  openBottomSheet: (param: achievementType) => (event: React.MouseEvent) => void;
}

function Achievement({
  achievementList,
  openBottomSheet,
}: achievementPropsType) {
  return (
    <body className="achievement-page-body">
      <div className="achievement-page-body-achievements-title">내가 획득한 업적</div>
      <div className="achievement-page-body-achievements-count">총 {achievementList.length}개 획득</div>
      <div className="achievement-page-body-achievements-images">
        {achievementList
          .sort((a: achievementType, b: achievementType) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))
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
