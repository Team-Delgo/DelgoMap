import classNames from 'classnames';
import React from 'react';

function DetailInfo() {
  return (
    <div className="detail-info">
      <div className="detail-info-dog">
        <div className="detail-info-dog-profile">
          <img
            className="detail-fino-dog-profile-photo"
            src="https://t1.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/4arX/image/wsbERl81yj07Mb44fWFboT6JYKU.jpg"
            alt="dog"
          />
          <div className="detail-info-dog-profile-name">
            <div className="detail-info-dog-profile-name-tag">상주견</div>
            <div className="detail-info-dog-profile-name-name">또리</div>
          </div>
        </div>
        <div className="detail-info-dog-instagram">@stoneandwater</div>
      </div>
      <div className="detail-info-item">
        <div className="detail-info-item-first">강아지 대표 메뉴</div>
        <div className="detail-info-item-second">멍푸치노 4,000원</div>
      </div>
      <div className="detail-info-image">
        <img
          src="https://cdn.crowdpic.net/detail-thumb/thumb_d_77B030000F50D8AB1F474D467DCC7BB2.jpg"
          alt=""
        />
        <img
          src="https://cdn.crowdpic.net/detail-thumb/thumb_d_77B030000F50D8AB1F474D467DCC7BB2.jpg"
          alt=""
        />
        <img
          src="https://cdn.crowdpic.net/detail-thumb/thumb_d_77B030000F50D8AB1F474D467DCC7BB2.jpg"
          alt=""
        />
      </div>
      <div className="detail-info-div" />
      <div className="detail-info-item">
        <div className="detail-info-item-first">강아지 동반 안내</div>
        <div className="detail-info-item-second">
          자세히 보기
          <img src="" alt="" />
        </div>
      </div>
      <div className='detail-info-doglist'>
        <div className={classNames('detail-info-doglist-dog',{disable:false})}>소형견</div>
        <div className='detail-info-doglist-dot' />
        <div className={classNames('detail-info-doglist-dog',{disable:false})}>중형견</div>
        <div className='detail-info-doglist-dot' />
        <div className={classNames('detail-info-doglist-dog',{disable:true})}>대형견</div>
      </div>
      <div className="detail-info-div" />
      <div className="detail-info-item">
        <div className="detail-info-item-first">주차공간</div>
        <div className="detail-info-item-second">있음</div>
      </div>
    </div>
  );
}

export default DetailInfo;
