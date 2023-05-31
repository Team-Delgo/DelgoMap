import classNames from 'classnames';
import React, { useState } from 'react';
import RightArrow from '../../../common/icons/right-arrow-gray.svg';
import UnderArrow from '../../../common/icons/under-arrow-gray.svg';
import UpArrow from '../../../common/icons/up-arrow-gray.svg';

interface Props {
  residentDog: string;
  residentDogPhoto: string;
  instagram: string;
  representMenu: string;
  menuImages: string[];
  acceptSize: { S: string; M: string; L: string };
  isParking: boolean;
  parkingInfo: string;
  enterDsc:string;
  editorNoteUrl: string | null;
}

function DetailInfo({
  residentDog,
  residentDogPhoto,
  instagram,
  representMenu,
  menuImages,
  enterDsc,
  acceptSize,
  isParking,
  parkingInfo,
  editorNoteUrl,
}: Props) {
  const [isDogInfoOpen, setIsDogInfoOpen] = useState(false);
  return (
    <div className="detail-info">
      <div className="detail-info-dog">
        <div className="detail-info-dog-profile">
          <img
            className="detail-fino-dog-profile-photo"
            src={residentDogPhoto}
            alt="dog"
          />
          <div className="detail-info-dog-profile-name">
            <div className="detail-info-dog-profile-name-tag">상주견</div>
            <div className="detail-info-dog-profile-name-name">{residentDog}</div>
          </div>
        </div>
        <div className="detail-info-dog-instagram">{instagram}</div>
      </div>
      <div className="detail-info-item">
        <div className="detail-info-item-first">강아지 대표 메뉴</div>
        <div className="detail-info-item-second">{representMenu}</div>
      </div>
      <div className="detail-info-image">
        <img src={menuImages[0]} alt="" />
        <img src={menuImages[1]} alt="" />
        <img src={menuImages[2]} alt="" />
      </div>
      <div className="detail-info-div" />
      <div className="detail-info-item">
        <div className="detail-info-item-first">강아지 동반 안내</div>
        <div
          className="detail-info-item-second"
          aria-hidden
          onClick={() => setIsDogInfoOpen(!isDogInfoOpen)}
        >
          {!isDogInfoOpen ? (
            <>
              자세히 보기
              <img src={UnderArrow} alt="under-arrow" />
            </>
          ) : (
            <>
              접기 <img src={UpArrow} alt="up-arrow" />
            </>
          )}
        </div>
      </div>
      <div className="detail-info-doglist">
        <div className={classNames('detail-info-doglist-dog', { disable: false })}>
          소형견
        </div>
        <div className="detail-info-doglist-dot" />
        <div className={classNames('detail-info-doglist-dog', { disable: false })}>
          중형견
        </div>
        <div className="detail-info-doglist-dot" />
        <div className={classNames('detail-info-doglist-dog', { disable: true })}>
          대형견
        </div>
      </div>
      {isDogInfoOpen && <div className='detail-info-enterDesc'>{enterDsc}</div>}
      <div className="detail-info-div" />
      <div className="detail-info-item">
        <div className="detail-info-item-first">주차공간</div>
        <div className="detail-info-item-second">있음</div>
      </div>
      {editorNoteUrl && (
        <div className="detail-info-editor">
          <div aria-hidden className="detail-info-editor-button">
            에디터 노트로 이동
            <img src={RightArrow} alt="right-arrow" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailInfo;
