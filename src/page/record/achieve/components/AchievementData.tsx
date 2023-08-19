import React, { useEffect, useRef } from 'react';
import { achievementType } from '../../../../common/types/achievement';

interface achievementDataPropsType {
  achievement: achievementType;
  openBottomSheet: (achievement: achievementType) => (event: React.MouseEvent) => void;
}

function AchievementData({ achievement, openBottomSheet }: achievementDataPropsType) {
  const iconImg = useRef<HTMLImageElement>(null); //아이콘 이미지 참조 ref


   // 이미지가 뷰포트 내에 들어왔을 때 해당 이미지의 src 속성을 변경하는 함수(lazy loading을 위해)
  const observeImg = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) { //이미지가 뷰포트에 참조되면 
        entry.target.src = entry.target.dataset.src; //dataset.src값을 아이콘이미지 src에 넣어줌
        observer.unobserve(entry.target);  // 이미지가 뷰포트 내에 들어왔을 때 해당 이미지의 src 속성을 변경하는 함수
      }
    });
  };

   // 컴포넌트가 마운트 될 때, IntersectionObserver를 설정하여 업적 이미지 관찰
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
