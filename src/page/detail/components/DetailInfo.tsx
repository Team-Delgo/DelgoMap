import classNames from 'classnames';
import React, { useState } from 'react';
import RightArrow from '../../../common/icons/right-arrow-gray.svg';
import UnderArrow from '../../../common/icons/under-arrow-gray.svg';
import UpArrow from '../../../common/icons/up-arrow-gray.svg';
import Dog from '../../../common/icons/dog.svg';
import DetailDogAcceptable from './DetailDogAcceptable';

interface Props {
  residentDog: string | null;
  residentDogPhoto: string | null;
  instagram: string;
  representMenu: string | null;
  menuImages: string[];
  acceptSize: { S: string; M: string; L: string };
  parkingLimit: number;
  parkingInfo: string;
  enterDsc: string;
  editorNoteUrl: string | null;
  openEditor: () => void;
  openFullSlider: (index: number) => void;
}

function DetailInfo({
  residentDog,
  residentDogPhoto,
  instagram,
  representMenu,
  menuImages,
  enterDsc,
  acceptSize,
  parkingLimit,
  parkingInfo,
  editorNoteUrl,
  openEditor,
  openFullSlider,
}: Props) {
  const [isDogInfoOpen, setIsDogInfoOpen] = useState(false);
  console.log(acceptSize);

  return (
    <div className="detail-info">
      {residentDog && (
        <div className="detail-info-dog">
          <div className="detail-info-dog-profile">
            {residentDogPhoto ? (
              <img
                className="detail-info-dog-profile-photo"
                src={residentDogPhoto}
                alt="dog"
              />
            ) : (
              <div className="detail-info-dog-profile none" />
            )}
            <div className="detail-info-dog-profile-name">
              <div className="detail-info-dog-profile-name-tag">상주견</div>
              <div className="detail-info-dog-profile-name-name">{residentDog}</div>
            </div>
          </div>
          <a
            href={`https://instagram.com/${instagram.slice(1)}`}
            className="detail-info-dog-instagram"
          >
            {instagram}
          </a>
        </div>
      )}
      <div className="detail-info-item">
        <div className="detail-info-item-first">
          {representMenu ? '강아지 대표 메뉴' : '메뉴 이미지'}
        </div>
        <div className="detail-info-item-second">{representMenu}</div>
      </div>
      <div className="detail-info-image">
        <img aria-hidden src={menuImages[0]} onClick={() => openFullSlider(0)} alt="" />
        <img aria-hidden src={menuImages[1]} onClick={() => openFullSlider(1)} alt="" />
        <img aria-hidden src={menuImages[2]} onClick={() => openFullSlider(2)} alt="" />
      </div>
      <div className="detail-info-div" />
      <div className="detail-info-item">
        <div className="detail-info-item-first">강아지 동반 안내</div>
        <div
          className="detail-info-item-second type"
          aria-hidden
          onClick={() => setIsDogInfoOpen(!isDogInfoOpen)}
        >
          {!isDogInfoOpen ? '자세히 보기' : '접기'}
        </div>
      </div>
      <div className="detail-info-doglist">
        <DetailDogAcceptable type="소형견" allow={acceptSize.S} />
        <DetailDogAcceptable type="중형견" allow={acceptSize.M} />
        <DetailDogAcceptable type="대형견" allow={acceptSize.L} />
      </div>
      {isDogInfoOpen && <div className="detail-info-enterDesc">{enterDsc}</div>}
      <div className="detail-info-div" />
      <div className="detail-info-item">
        <div className="detail-info-item-first">주차공간</div>
        <div className="detail-info-item-second">있음</div>
      </div>
      {!residentDog && <div className="detail-info-div" />}
      {!residentDog && (
        <div className="detail-info-item">
          <div className="detail-info-item-first">인스타그램</div>
          <div className="detail-info-item-second">
            <a
              href={`https://instagram.com/${instagram.slice(1)}`}
              className="detail-info-dog-instagram"
            >
              {instagram}
            </a>
          </div>
        </div>
      )}
      {editorNoteUrl && (
        <div className="detail-info-editor">
          <div aria-hidden onClick={openEditor} className="detail-info-editor-button">
            에디터 노트로 이동
            <img src={RightArrow} alt="right-arrow" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailInfo;
