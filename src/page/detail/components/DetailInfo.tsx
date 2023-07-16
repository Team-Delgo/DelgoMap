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
    <div className="m-3 -translate-y-[5px] rounded-xl bg-white px-5 py-5">
      {residentDog && (
        <div className="mt-2 flex items-center justify-between pb-5">
          <div className="flex">
            {residentDogPhoto ? (
              <img
                className="h-[47px] w-[47px] rounded-[100%]"
                src={residentDogPhoto}
                alt="dog"
              />
            ) : (
              <div className="h-[47px] w-[47px] rounded-[100%] bg-[url('./common/icons/dog.svg')] bg-cover" />
            )}
            <div className="ml-4 flex flex-col justify-center">
              <div className="text-xs font-medium text-[#646566]">상주견</div>
              <div className="text-sm font-medium">{residentDog}</div>
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
          <div className="text-sm font-medium">
            {representMenu
              ? '강아지 대표 메뉴'
              : categoryCode === 'CA0005' || 'CA0006'
              ? '가격표 이미지'
              : '메뉴 이미지'}
          </div>
          <div className="flex items-center text-sm font-normal text-[#646566]">
            {representMenu}
          </div>
        </div>
      )}
      {menuImages && menuImages.length >= 1 && (
        <div className="mt-2.5 flex justify-center">
          <img
            className="mr-[3px] aspect-square w-[32.7%]"
            aria-hidden
            src={menuImages[0]}
            onClick={() => openFullSlider(0)}
            alt=""
          />
          {menuImages.length >= 2 && (
            <img
              className="mr-[3px] aspect-square w-[32.7%]"
              aria-hidden
              src={menuImages[1]}
              onClick={() => openFullSlider(1)}
              alt=""
            />
          )}
          {menuImages.length >= 3 && (
            <img
              className="mr-[3px] aspect-square w-[32.7%]"
              aria-hidden
              src={menuImages[2]}
              onClick={() => openFullSlider(2)}
              alt=""
            />
          )}
        </div>
      )}
      {menuImages && <div className="mt-[18px] h-[1px] w-full bg-[#e6e6e6]" />}
      <div className="mt-5 flex justify-between">
        <div className="text-sm font-medium">강아지 동반 안내</div>
        <div
          className="flex text-sm font-medium text-[#7a5ccf]"
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
        <div className="mt-5 whitespace-pre-line text-sm font-normal leading-[150%]">
          {enterDsc}
        </div>
      )}
      <div className="mt-[18px] h-[1px] w-full bg-[#e6e6e6]" />
      <div className="mt-5 flex justify-between">
        <div className="text-sm font-medium">주차공간</div>
        <div className="text-sm font-medium text-[#7a5ccf]">
          {isParking ? '있음' : '없음'}
        </div>
      </div>
      {parkingInfo && (
        <div className="mt-5 whitespace-pre-line text-sm font-normal leading-[150%]">
          {parkingInfo}
        </div>
      )}
      {!residentDog && <div className="mt-[18px] h-[1px] w-full bg-[#e6e6e6]" />}
      {!residentDog && (
        <div className="mt-5 flex justify-between">
          <div className="text-sm font-medium">인스타그램</div>
          <div className="flex items-center text-sm font-normal text-[#646566]">
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
        <div className="mt-10 flex w-full justify-center">
          <div
            aria-hidden
            onClick={openEditor}
            className="flex items-center rounded-[31px] border border-[#ababab] px-[33px] py-2.5 text-center text-sm font-medium"
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
