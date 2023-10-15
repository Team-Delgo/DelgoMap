import React from 'react';
import DogFoot from '../../../../common/icons/dogfoot.svg';
import Heart from '../../../../common/icons/heart.svg';

interface Props {
  visited: number;
}

function DetailReviewHeader({ visited }: Props) {
  return (
    <div className="m-[23px] pt-[30px] pb-[20px] border-b border-gray-300 font-[400]">
      <div className="flex items-center">
        <img className="w-[18px]" src={DogFoot} alt="dogfoot" />
        <span className="text-[16px] font-[500] mx-[7px]">여기에 남긴 기록 {visited}개</span>
      </div>
      <span className="text-[12px] font-normal text-gray-700">
        친구들이 {visited}번 다녀갔어요
      </span>
      <div className="detail-review-header-div" />
    </div>
  );
}

export default DetailReviewHeader;
