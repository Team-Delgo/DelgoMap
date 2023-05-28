import React from 'react';
import DogFoot from "../../../common/icons/dogfoot.svg";
import Heart from "../../../common/icons/heart.svg";
import Phone from "../../../common/icons/phone.svg";
import Upload from "../../../common/icons/upload.svg";
import Clock from "../../../common/icons/clock.svg";

function DetailHeader() {
  return (
    <div className="detail-header">
      <div className="detail-header-title">
        <h2>스톤앤워터</h2>
        <div className="detail-header-heart">
          <img src={DogFoot} alt="foot" />
          <span>22</span>
          <div className='detail-header-dot'/>
          <img src={Heart} alt="heart" />
          <span>14</span>
        </div>
      </div>
      <div className="detail-header-address">서울시 송파구 오금동 11-11 202호</div>
      <div className="detail-header-interaction">
        <div className="detail-header-interaction-button">
          <img src={Phone} alt="phone" />
          전화
        </div>
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
        <div className="detail-header-interaction-button">
          <img src={Clock} alt="time" />
          영업시간
        </div>
      </div>
    </div>
  );
}

export default DetailHeader;
