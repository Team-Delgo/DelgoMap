import React, { useEffect, useRef } from 'react';
import NotChecked from '../../../common/icons/not-checked.svg';
import { achievementType } from '../../../common/types/achievement';

interface achievementDataPropsType {
  achievement: achievementType;
  selectRepresentativeAchievements: (achievement: achievementType) => (event: React.MouseEvent) => void;
  editActivation: boolean;
  openBottomSheet: (achievement: achievementType) => (event: React.MouseEvent) => void;
}

function AchievementData({ achievement, selectRepresentativeAchievements, editActivation, openBottomSheet }: achievementDataPropsType) {
  const iconImg = useRef<HTMLImageElement>(null);

  const observeImg = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observeImg);
    iconImg.current && observer.observe(iconImg.current);
  }, []);

  return (
    <div
      className="achievement-page-body-achievements-image-container"
      aria-hidden="true"
      onClick={editActivation ? (achievement.isActive === true ? selectRepresentativeAchievements(achievement) : undefined) : undefined}
    >
      <div className="achievement-page-body-achievements-image" key={achievement.achievementsId}>
        <img
          data-src={
            achievement.isActive ? achievement.imgUrl : 'https://kr.object.ncloudstorage.com/reward-achivements/%EC%9E%A0%EA%B8%88.png'
          }
          ref={iconImg}
          alt="post-img"
          width={103}
          height={113}
          aria-hidden="true"
          onClick={editActivation === false ? openBottomSheet(achievement) : undefined}
        />
        <div className="achievement-page-body-achievements-image-name">{achievement.name}</div>
        {editActivation ? (
          achievement.isActive ? (
            <img
              src={NotChecked}
              className="achievement-page-body-achievements-image-check-img"
              alt="post-img"
              width={20}
              height={20}
              aria-hidden="true"
            />
          ) : null
        ) : null}
      </div>
    </div>
  );
}

export default AchievementData;
