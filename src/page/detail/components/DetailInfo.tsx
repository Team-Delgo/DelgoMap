import classNames from 'classnames';
import React, { useState } from 'react';
import RightArrow from '../../../common/icons/right-arrow-gray.svg';
import UnderArrow from '../../../common/icons/under-arrow-gray.svg';
import UpArrow from '../../../common/icons/up-arrow-gray.svg';
import Dog from '../../../common/icons/dog.svg';
import DetailDogAcceptable from './DetailDogAcceptable';

interface Props {
  categoryCode: string;
  residentDog: string | null;
  residentDogPhoto: string | null;
  instagram: string;
  representMenu: string | null;
  menuImages: string[];
  isPriceTag: boolean;
  acceptSize: { S: string; M: string; L: string };
  isParking: boolean;
  parkingInfo: string;
  enterDsc: string;
  editorNoteUrl: string | null;
  openEditor: () => void;
  openFullSlider: (index: number) => void;
}

function DetailInfo({
  categoryCode,
  residentDog,
  residentDogPhoto,
  instagram,
  representMenu,
  menuImages,
  enterDsc,
  acceptSize,
  isPriceTag,
  isParking,
  parkingInfo,
  editorNoteUrl,
  openEditor,
  openFullSlider,
}: Props) {
  const [isDogInfoOpen, setIsDogInfoOpen] = useState(false);
  console.log(acceptSize);
  return (
    <div className="-translate-y-[5px] m-3 px-5 py-5 bg-white rounded-xl">
      {residentDog && (
        <div className="flex justify-between items-center mt-2 pb-5">
          <div className="flex">
            {residentDogPhoto ? (
              <img
                className="w-[47px] h-[47px] rounded-[100%]"
                src={residentDogPhoto}
                alt="dog"
              />
            ) : (
              <div className="w-[47px] h-[47px] rounded-[100%] bg-[url('./common/icons/dog.svg')] bg-cover" />
            )}
            <div className="flex flex-col justify-center ml-4">
              <div className="text-xs font-medium text-[#646566]">상주견</div>
              <div className="font-medium text-sm">{residentDog}</div>
            </div>
          </div>
          <a
            href={`https://instagram.com/${instagram.slice(1)}`}
            className="text-xs font-normal text-[#4190da]"
          >
            {instagram}
          </a>
        </div>
      )}
      {menuImages && (
        <div className="mt-5 flex justify-between">
          <div className="font-medium text-sm">
            {representMenu
              ? '강아지 대표 메뉴'
              : categoryCode === 'CA0005' || 'CA0006'
              ? '가격표 이미지'
              : '메뉴 이미지'}
          </div>
          <div className="flex items-center font-normal text-sm text-[#646566]">
            {representMenu}
          </div>
        </div>
      )}
      {menuImages && menuImages.length >= 1 && (
        <div className="flex mt-2.5 justify-center">
          <img
            className="w-[32.7%] aspect-square mr-[3px]"
            aria-hidden
            src={menuImages[0]}
            onClick={() => openFullSlider(0)}
            alt=""
          />
          {menuImages.length >= 2 && (
            <img
              className="w-[32.7%] aspect-square mr-[3px]"
              aria-hidden
              src={menuImages[1]}
              onClick={() => openFullSlider(1)}
              alt=""
            />
          )}
          {menuImages.length >= 3 && (
            <img
              className="w-[32.7%] aspect-square mr-[3px]"
              aria-hidden
              src={menuImages[2]}
              onClick={() => openFullSlider(2)}
              alt=""
            />
          )}
        </div>
      )}
      {menuImages && <div className="w-full h-[1px] mt-[18px] bg-[#e6e6e6]" />}
      <div className="mt-5 flex justify-between">
        <div className="font-medium text-sm">강아지 동반 안내</div>
        <div
          className="flex font-medium text-sm text-[#7a5ccf]"
          aria-hidden
          onClick={() => setIsDogInfoOpen(!isDogInfoOpen)}
        >
          {!isDogInfoOpen ? (
            <>
              자세히 보기
              <img className="ml-[.3rem]" src={UnderArrow} alt="under-arrow" />
            </>
          ) : (
            <>
              접기 <img className="ml-[.3rem]" src={UpArrow} alt="up-arrow" />
            </>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center">
        <DetailDogAcceptable type="소형견" allow={acceptSize.S} />
        <DetailDogAcceptable type="중형견" allow={acceptSize.M} />
        <DetailDogAcceptable type="대형견" allow={acceptSize.L} />
      </div>
      {isDogInfoOpen && (
        <div className="whitespace-pre-line leading-[150%] mt-5 text-sm font-normal">
          {enterDsc}
        </div>
      )}
      <div className="w-full h-[1px] mt-[18px] bg-[#e6e6e6]" />
      <div className="mt-5 flex justify-between">
        <div className="font-medium text-sm">주차공간</div>
        <div className="font-medium text-sm text-[#7a5ccf]">
          {isParking ? '있음' : '없음'}
        </div>
      </div>
      {parkingInfo && (
        <div className="whitespace-pre-line leading-[150%] mt-5 text-sm font-normal">
          {parkingInfo}
        </div>
      )}
      {!residentDog && <div className="w-full h-[1px] mt-[18px] bg-[#e6e6e6]" />}
      {!residentDog && (
        <div className="mt-5 flex justify-between">
          <div className="font-medium text-sm">인스타그램</div>
          <div className="flex items-center font-normal text-sm text-[#646566]">
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
        <div className="mt-10 w-full flex justify-center">
          <div
            aria-hidden
            onClick={openEditor}
            className="flex items-center text-center text-sm font-medium px-[33px] py-2.5 border border-[#ababab] rounded-[31px]"
          >
            에디터 노트로 이동
            <img className="ml-[7px]" src={RightArrow} alt="right-arrow" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailInfo;
