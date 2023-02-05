import React from 'react';
import { achievementType } from '../../../common/types/achievement';
import AchievementData from './AchievementData';

interface achievementPropsType {
  editActivation: boolean;
  achievementList: Array<achievementType>;
  selectRepresentativeAchievements: (param: achievementType) => (event: React.MouseEvent) => void;
  achievementListCount: number;
  openBottomSheet: (param: achievementType) => (event: React.MouseEvent) => void;
}

function Achievement({
  editActivation,
  achievementList,
  selectRepresentativeAchievements,
  achievementListCount,
  openBottomSheet,
}: achievementPropsType) {
  return (
    <body className="achievement-page-body">
      <div className="achievement-page-body-achievements-title">내가 획득한 업적</div>
      <div className="achievement-page-body-achievements-count">총 {achievementListCount}개 획득</div>
      <div className="achievement-page-body-achievements-images">
        {achievementList
          .sort((a: achievementType, b: achievementType) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))
          .map((achievement: achievementType) => (
            <AchievementData
              achievement={achievement}
              selectRepresentativeAchievements={selectRepresentativeAchievements}
              editActivation={editActivation}
              openBottomSheet={openBottomSheet}
            />
          ))}
      </div>
    </body>
  );
}

export default Achievement;
