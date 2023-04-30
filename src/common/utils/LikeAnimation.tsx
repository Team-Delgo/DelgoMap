import React from 'react';
import LikeAnimationGif from '../icons/like-animation.gif';
import UnLikeAnimationGif from '../icons/unlike-animation.gif';
import './LikeAnimation.scss';

interface Props {
  isLike: boolean;
}

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
