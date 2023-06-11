import React, { useState } from 'react';
import DogFoot from '../../../common/icons/dogfoot.svg';
import Heart from '../../../common/icons/heart.svg';
import Phone from '../../../common/icons/phone.svg';
import Upload from '../../../common/icons/upload.svg';
import Clock from '../../../common/icons/clock.svg';
import Arrow from '../../../common/icons/up-arrow.svg';

interface Props {
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
}: Props) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  return (
    <div className="detail-header">
      <div className="detail-header-title">
        <h2>{placeName}</h2>
        <div className="detail-header-heart">
          <img src={DogFoot} alt="foot" />
          <span>{dogFootCount}</span>
          <div className="detail-header-dot" />
          <img src={Heart} alt="heart" />
          <span>{heartCount}</span>
        </div>
      </div>
      <div className="detail-header-address">{address}</div>
      <div className="detail-header-interaction">
        <a href={`tel:${phoneNumber}`} className="detail-header-interaction-button">
          <img src={Phone} alt="phone" />
          전화
        </a>
        <div className="detail-header-interaction-div" />
        <div className="detail-header-interaction-button">
          <img src={Upload} alt="upload" />
          공유
        </div>
        <div className="detail-header-interaction-div" />
        {/* <div className="detail-interaction-button">
          <img src="" alt="star" />
          저장
        </div>
        <div className="detail-interaction-div" /> */}
        <div
          aria-hidden
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          className="detail-header-interaction-button"
        >
          <img src={Clock} alt="time" />
          영업시간
        </div>
      </div>
      {isInfoOpen && <div className="detail-header-infodiv" />}
      {isInfoOpen && (
        <div className="detail-header-hours">
          <div className="detail-header-days">
            <div className="detail-header-days-item">
              월 <span>{openingHours.MON}</span>
            </div>
            <div className="detail-header-days-item">
              화 <span>{openingHours.TUE}</span>
            </div>
            <div className="detail-header-days-item">
              수 <span>{openingHours.WED}</span>
            </div>
            <div className="detail-header-days-item">
              목 <span>{openingHours.THU}</span>
            </div>
            <div className="detail-header-days-item">
              금 <span>{openingHours.FRI}</span>
            </div>
            <div className="detail-header-days-item">
              토 <span>{openingHours.SAT}</span>
            </div>
            <div className="detail-header-days-item">
              일 <span>{openingHours.SUN}</span>
            </div>
          </div>
          <div className="detail-header-info">
            <div className="detail-header-info-item">라스트 오더</div>
            <div className="detail-header-info-value">{openingHours.LAST_ORDER}</div>
            <div className="detail-header-info-item">브레이크 타임</div>
            <div className="detail-header-info-value">
              {openingHours.BREAK_TIME.length > 0 ? openingHours.BREAK_TIME : '없음'}
            </div>
            <div className="detail-header-info-item">휴무</div>
            <div className="detail-header-info-value">
              {openingHours.HOLIDAY.length > 0 ? openingHours.HOLIDAY : '없음'}
            </div>
          </div>
        </div>
      )}
      {isInfoOpen && (
        <div className="detail-header-close">
          <div
            className="detail-header-close-button"
            aria-hidden
            onClick={() => setIsInfoOpen(false)}
          >
            닫기 <img src={Arrow} alt="arrow" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailHeader;
