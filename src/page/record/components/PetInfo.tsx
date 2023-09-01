import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getMyProfileInfo, getOtherProfileInfo } from 'common/api/myaccount';
import BallLoading from 'common/utils/BallLoading';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useNavigate } from 'react-router-dom';
import { ROOT_PATH, RECORD_PATH } from '../../../common/constants/path.const';

function PetInfo() {
  const splitUrl = window.location.href.split('/');
  const userId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const myId = useSelector((state: RootState) => state.persist.user.user.id);
  const navigate = useNavigate();
  let isMyAccount = true;
  if (userId === myId) isMyAccount = true;
  else isMyAccount = false;
  const { data, isLoading } = useQuery(['getPetdata', userId], () => {
    if (isMyAccount) return getMyProfileInfo(userId);
    else return getOtherProfileInfo(userId);
  });

  if (data === undefined || isLoading) return <BallLoading />;

  let year;
  if (data.data.yearOfPetAge === 0) {
    year = data.data.monthOfPetAge;
  } else {
    year = data.data.yearOfPetAge;
  }

  const mapButtonHandler = () => {
    if (isMyAccount) window.BRIDGE.shareDelgoProfile(window.location.href);
    else navigate(`${RECORD_PATH.MAP}/${userId}`);
  };
  return (
    <header className=" fixed z-20 mt-[80px] flex w-screen bg-white">
      <img
        className="ml-[16.51px] h-[82.246px] w-[83.492px] rounded-full"
        src={data.data.profile}
        alt="copy url"
        width={81}
        height={81}
      />
      <div className="flex h-[36px] w-screen flex-col">
        <div className="flex">
          <div className="ml-[21px] h-[36px] text-[24px] font-bold leading-9 tracking-[0.72px]">
            {data.data.nickname}
          </div>
          <div className="ml-[19px] mt-[9px] h-[18px] text-[16px] font-medium leading-[18px]">
            {data.data.petName}/
          </div>
          <div className=" mt-[9px] h-[18px] text-[12px] font-medium leading-[18px]">
            {year} {data.data.breedName}
          </div>
        </div>
        <div
          className="ml-[12px] mr-[20px] mt-[6px] justify-center rounded-[17px] border-[1px] border-solid border-[#ECE5FF] bg-[#F3EEFF] py-[7px] text-center text-sm font-medium text-[#4725A7]"
          onClick={mapButtonHandler}
        >
          {isMyAccount ? '프로필공유' : '지도보기'}
        </div>
      </div>
    </header>
  );
}

export default PetInfo;
