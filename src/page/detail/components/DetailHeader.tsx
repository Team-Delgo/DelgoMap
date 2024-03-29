import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import 'index.css';
import DogFoot from '../../../common/icons/dogfoot.svg';
import Phone from '../../../common/icons/phone.svg';
import Upload from '../../../common/icons/upload.svg';
import Clock from '../../../common/icons/clock.svg';
import Arrow from '../../../common/icons/up-arrow.svg';
import Star from '../../../common/icons/star.svg';
import StartEmpty from '../../../common/icons/star-empty.svg';
import { useMutation, useQueryClient } from 'react-query';
import { setBookmark } from 'common/api/detail';

interface Props {
  categoryCode: string;
  placeName: string;
  address: string;
  dogFootCount: number;
  bookmarkCount: number;
  phoneNumber: string;
  openingHours: OpeningHours;
  isBookmarked: boolean;
  mungpleId: number;
}

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
  phoneNumber,
  openingHours,
  bookmarkCount,
  categoryCode,
  isBookmarked,
  mungpleId,
}: Props) {
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [bookmarkCountState, setBookMarkCountState] = useState(bookmarkCount);
  const [isBookmark, setIsBookmark] = useState(isBookmarked);
  const queryClient = useQueryClient();
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const sendScrap = async () => {
    console.log('click');
    if (OS === 'android') window.BRIDGE.shareDelgoProfile(window.location.href);
    else
      window.webkit.messageHandlers.shareDelgoProfile.postMessage(window.location.href);
  };
  const { mutate: setBookmarkMutation } = useMutation(
    () => setBookmark(userId, mungpleId),
    {
      onSuccess: (data) => {
        setIsBookmark(data.isBookmarked);
        if(data.isBookmarked) {
          setBookMarkCountState(bookmarkCountState + 1);
        }else {
          setBookMarkCountState(bookmarkCountState - 1);
        }
        queryClient.invalidateQueries(['getMapData', userId]);
        queryClient.refetchQueries(['getMapData', userId]);
        queryClient.invalidateQueries(['getDetailPageData', mungpleId]);
        queryClient.refetchQueries(['getDetailPageData', mungpleId]);
      },
    },
  );
  return (
    <div className="-translate-y-[5px] bg-white p-5">
      <div className="flex justify-between">
        <div className="m-0 text-xl font-medium leading-[150%] tracking-[0.6px]">
          {placeName}
        </div>
        <div className="flex items-center text-xs font-medium">
          <img className="mr-1 w-3" src={DogFoot} alt="foot" />
          <span>{dogFootCount}</span>
          <div className="mx-[3px] h-[3px] w-[3px] rounded-[100%] bg-[#ababab]" />
          <img className="mr-1 w-3" src={isBookmark ? Star : StartEmpty} alt="heart" />
          <span>{bookmarkCountState}</span>
        </div>
      </div>
      <div className="mt-1 text-xs font-normal text-[#646566]">{address}</div>
      <div className="mt-9 flex justify-evenly pb-[10px] text-sm font-normal">
        {phoneNumber.length > 0 ? (
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center leading-[150%] text-black no-underline"
          >
            <img className="mr-[6px]" src={Phone} alt="phone" />
            전화
          </a>
        ) : (
          <div className="flex items-center leading-[150%] text-black no-underline opacity-50">
            <img className="mr-[6px]" src={Phone} alt="phone" />
            전화
          </div>
        )}
        <div className="h-[21px] w-[1px] bg-[#e6e6e6]" />
        <div
          className="flex items-center leading-[150%] text-black no-underline"
          onClick={sendScrap}
          aria-hidden
        >
          <img className="mr-[6px]" src={Upload} alt="upload" />
          공유
        </div>
        <div className="h-[21px] w-[1px] bg-[#e6e6e6]" />
        <div
          aria-hidden
          onClick={() => setBookmarkMutation()}
          className={`flex items-center leading-[150%] 
          ${isBookmark ? 'text-[#6f40f3]' : 'text-black'} 
          ${isBookmark ? 'font-medium' : 'font-normal'} 
          no-underline`}
        >
          <img
            className="mr-[6px] h-[15px] w-[15px]"
            src={isBookmark ? Star : StartEmpty}
            alt="time"
          />
          저장
        </div>
        <div className="h-[21px] w-[1px] bg-[#e6e6e6]" />
        <div
          aria-hidden
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          className="flex items-center leading-[150%] text-black no-underline"
        >
          <img className="mr-[6px] h-[15px] w-[15px]" src={Clock} alt="time" />
          {categoryCode === 'CA0005' ? '운영시간' : '영업시간'}
        </div>
      </div>
      {isInfoOpen && <div className="mt-[10px] h-[1px] w-full bg-[#e6e6e6]" />}
      {isInfoOpen && (
        <div className="flex justify-evenly p-[13px]">
          <div className="text-sm font-medium">
            <div className="m-[5px]">
              월 <span className="ml-[5px] font-normal">{openingHours.MON}</span>
            </div>
            <div className="m-[5px]">
              화 <span className="ml-[5px] font-normal">{openingHours.TUE}</span>
            </div>
            <div className="m-[5px]">
              수 <span className="ml-[5px] font-normal">{openingHours.WED}</span>
            </div>
            <div className="m-[5px]">
              목 <span className="ml-[5px] font-normal">{openingHours.THU}</span>
            </div>
            <div className="m-[5px]">
              금 <span className="ml-[5px] font-normal">{openingHours.FRI}</span>
            </div>
            <div className="m-[5px]">
              토 <span className="ml-[5px] font-normal">{openingHours.SAT}</span>
            </div>
            <div className="m-[5px]">
              일 <span className="ml-[5px] font-normal">{openingHours.SUN}</span>
            </div>
          </div>
          <div className="text-sm font-medium">
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
        <div className="flex w-full items-center justify-center">
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
