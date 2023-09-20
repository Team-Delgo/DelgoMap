import React from 'react';
import DogFoot from '../../../../common/icons/dogfoot.svg';
import Heart from '../../../../common/icons/heart.svg';

interface Props {
  visited: number;
  heart: number;
}

function DetailReviewHeader({ visited, heart }: Props) {
  return (
    <div className="m-[23px] pt-[30px] pb-[20px] border-b border-gray-300 font-[400]">
      <div className="flex items-center">
        <img className="w-[18px]" src={DogFoot} alt="dogfoot" />
        <span className="text-[16px] font-[500] mx-[7px]">방문 {visited}</span>
        <span className="text-[14px] font-[500] flex flex-row">
          (<img src={Heart} className="mx-[3px]" alt="heart" />
          추천 {heart}
          <span className="ml-[3px]">)</span>
        </span>
      </div>
      <span className="text-[12px] font-normal text-gray-700">
        여기에 {visited}마리의 친구들이 방문했어요
      </span>
      <div className="detail-review-header-div" />
      {/* ????? */}
    </div>
  );
}

export default DetailReviewHeader;
