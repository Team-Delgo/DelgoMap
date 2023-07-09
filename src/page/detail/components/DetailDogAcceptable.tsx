import React from 'react';
import Circle from '../../../common/icons/circle.svg';
import Triangle from '../../../common/icons/trianlge.svg';
import X from '../../../common/icons/small-x.svg';

interface Props {
  type: string;
  allow: string;
}

function DetailDogAcceptable({ type, allow }: Props) {
  let className =
    'flex justify-center items-center rounded-[4px] mr-1 w-[65px] h-6 text-xs font-normal text-white';
  let icon;
  if (allow === 'ALLOW') {
    className += ' bg-[#7a5ccf]';
    icon = Circle;
  } else if (allow === 'OUTDOOR') {
    className += ' bg-[#aa93ec]';
    icon = Triangle;
  } else {
    className += ' bg-[#ababab]';
    icon = X;
  }

  return (
    <div className={className}>
      <img className="mr-1" src={icon} alt="icon" />
      {type}
    </div>
  );
}

export default DetailDogAcceptable;
