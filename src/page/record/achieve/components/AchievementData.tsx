import React, { useEffect, useRef } from 'react';
import { achievementType } from '../../../../common/types/achievement';

interface achievementDataPropsType {
  achievement: achievementType;
  openBottomSheet: (achievement: achievementType) => (event: React.MouseEvent) => void;
}

function AchievementData({ achievement, openBottomSheet }: achievementDataPropsType) {
  const iconImg = useRef<HTMLImageElement>(null);

  const observeImg = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) => {
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
    <div className="achievement-page-body-achievements-image-container">
      <div
        className="achievement-page-body-achievements-image"
        key={achievement.achievementsId}
      >
        <img
          data-src={
            achievement.isActive
              ? achievement.imgUrl
              : 'https://kr.object.ncloudstorage.com/reward-achievements/%EC%9E%A0%EA%B8%88.png'
          }
          ref={iconImg}
          alt="post-img"
          width={103}
          height={113}
          aria-hidden="true"
          onClick={openBottomSheet(achievement)}
        />
        <div className="achievement-page-body-achievements-image-name">
          {achievement.name}
        </div>
      </div>
    </div>
  );
}

export default AchievementData;
