import React from 'react';
import LikeAnimationGif from '../icons/like-animation.gif';
import UnLikeAnimationGif from '../icons/unlike-animation.gif';
import './LikeAnimation.scss';

interface Props {
  isLike: boolean;
}

//동네강아지들 포스트에 이미지 더블클릭하면 동작하는 에니메이션 이미지

function LikeAnimation({ isLike }: Props) {
  return (
    <div className="like-animation">
      <img
        src={isLike ? LikeAnimationGif : UnLikeAnimationGif}
        alt="like-animation"
        width={200}
        height={200}
      />
    </div>
  );
}

export default LikeAnimation;
