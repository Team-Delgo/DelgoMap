import React, { useState } from 'react';
import DogFoot from '../../../common/icons/dogfoot.svg';
import Heart from '../../../common/icons/heart.svg';
import Phone from '../../../common/icons/phone.svg';
import Upload from '../../../common/icons/upload.svg';
import Clock from '../../../common/icons/clock.svg';
import Arrow from '../../../common/icons/up-arrow.svg';

interface Props {
  categoryCode: string;
  placeName: string;
  address: string;
  dogFootCount: number;
  heartCount: number;
  phoneNumber: string;
  openingHours: OpeningHours;
}
// interface OpeningHours {
//   mon: string;
//   tue: string;
//   wed: string;
//   thu: string;
//   fri: string;
//   sat: string;
//   sun: string;
//   lastOrder: string;
// }

interface OpeningHours {
  MON: string;
  TUE: string;
  WED: string;
  THU: string;
  FRI: string;
  SAT: string;
  SUN: string;
  LAST_ORDER: string;
  BREAK_TIME: string;
  HOLIDAY: string;
}

function DetailHeader({
  placeName,
  address,
  dogFootCount,
  heartCount,
  phoneNumber,
  openingHours,
  categoryCode,
}: Props) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const sendScrap = async () => {
    await window.kakao.Share.sendScrap({
      requestUrl: 'http://go.delgo.pet/',
      templateId: 92943,
    });
  };
  return (
    <div className="-translate-y-[5px] bg-white p-5">
      <div className="flex justify-between">
        <div className="m-0 text-xl font-medium leading-[150%] tracking-[0.6px]">
          {placeName}
        </div>
        <div className="flex items-center text-xs font-medium">
          <img className="w-3 mr-1" src={DogFoot} alt="foot" />
          <span>{dogFootCount}</span>
          <div className="w-[3px] h-[3px] rounded-[100%] bg-[#ababab] mx-[3px]" />
          <img className="w-3 mr-1" src={Heart} alt="heart" />
          <span>{heartCount}</span>
        </div>
      </div>
      <div className="mt-1 text-xs font-normal text-[#646566]">{address}</div>
      <div className="pb-[10px] mt-9 text-sm font-normal flex justify-evenly">
        <a
          href={`tel:${phoneNumber}`}
          className="flex items-center leading-[150%] no-underline text-black"
        >
          <img className="mr-[6px]" src={Phone} alt="phone" />
          전화
        </a>
        <div className="w-[1px] h-[21px] bg-[#e6e6e6]" />
        <div
          className="flex items-center leading-[150%] no-underline text-black"
          onClick={sendScrap}
          aria-hidden
        >
          <img className="mr-[6px]" src={Upload} alt="upload" />
          공유
        </div>
        <div className="w-[1px] h-[21px] bg-[#e6e6e6]" />
        {/* <div className="detail-interaction-button">
          <img src="" alt="star" />
          저장
        </div>
        <div className="detail-interaction-div" /> */}
        <div
          aria-hidden
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          className="flex items-center leading-[150%] no-underline text-black"
        >
          <img className="mr-[6px]" src={Clock} alt="time" />
          {categoryCode === 'CA0005' ? '운영시간' : '영업시간'}
        </div>
      </div>
      {isInfoOpen && <div className="mt-[10px] w-full h-[1px] bg-[#e6e6e6]" />}
      {isInfoOpen && (
        <div className="p-[13px] flex justify-evenly">
          <div className="text-sm font-medium">
            <div className="m-[5px]">
              월 <span className="font-normal ml-[5px]">{openingHours.MON}</span>
            </div>
            <div className="m-[5px]">
              화 <span className="font-normal ml-[5px]">{openingHours.TUE}</span>
            </div>
            <div className="m-[5px]">
              수 <span className="font-normal ml-[5px]">{openingHours.WED}</span>
            </div>
            <div className="m-[5px]">
              목 <span className="font-normal ml-[5px]">{openingHours.THU}</span>
            </div>
            <div className="m-[5px]">
              금 <span className="font-normal ml-[5px]">{openingHours.FRI}</span>
            </div>
            <div className="m-[5px]">
              토 <span className="font-normal ml-[5px]">{openingHours.SAT}</span>
            </div>
            <div className="m-[5px]">
              일 <span className="font-normal ml-[5px]">{openingHours.SUN}</span>
            </div>
          </div>
          <div className="font-medium text-sm">
            <div className="m-[5px]">라스트 오더</div>
            <div className="m-[5px] mb-4 font-normal">{openingHours.LAST_ORDER}</div>
            <div className="m-[5px]">브레이크 타임</div>
            <div className="m-[5px] mb-4 font-normal">
              {openingHours.BREAK_TIME.length > 0 ? openingHours.BREAK_TIME : '없음'}
            </div>
            <div className="m-[5px]">휴무</div>
            <div className="m-[5px] mb-4 font-normal">
              {openingHours.HOLIDAY.length > 0 ? openingHours.HOLIDAY : '없음'}
            </div>
          </div>
        </div>
      )}
      {isInfoOpen && (
        <div className="w-full flex justify-center items-center">
          <div
            className="flex items-center"
            aria-hidden
            onClick={() => setIsInfoOpen(false)}
          >
            닫기 <img className="ml-[10px]" src={Arrow} alt="arrow" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailHeader;
