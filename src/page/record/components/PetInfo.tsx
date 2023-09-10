import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getMyProfileInfo, getOtherProfileInfo } from 'common/api/myaccount';
import BallLoading from 'common/utils/BallLoading';
import { useSelector } from 'react-redux';
import { postVeiwCount } from '../../../common/api/othersmap';
import { RootState } from 'redux/store';
import { useNavigate } from 'react-router-dom';
import dot from '../../../common/icons/dot.svg';
import { ROOT_PATH, RECORD_PATH } from '../../../common/constants/path.const';

function PetInfo() {
  const splitUrl = window.location.href.split('/');
  const userId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const myId = useSelector((state: RootState) => state.persist.user.user.id);
  const navigate = useNavigate();
  let isMyAccount = false;
  if (userId === myId) isMyAccount = true;
  else isMyAccount = false;
  const { data, isLoading } = useQuery(['getPetdata', userId], () => {
    if (isMyAccount) return getMyProfileInfo(userId);
    else return getOtherProfileInfo(userId);
  });
  console.log(data);
  if (data === undefined || isLoading) return <BallLoading />;

  let year;
  if (data.yearOfPetAge === 0) {
    year = data.monthOfPetAge + '개월';
  } else {
    year = data.yearOfPetAge + '살';
  }

  const mapButtonHandler = () => {
    if (isMyAccount) {
      if (OS === 'android') window.BRIDGE.shareDelgoProfile(window.location.href);
      else window.webkit.messageHandlers.shareProfile.postMessage(window.location.href);
    } else {
      postVeiwCount(userId);
      navigate(`${RECORD_PATH.MAP}/${userId}`);
    }
  };
  return (
    <div className=" fixed z-20 mt-[60px] w-screen">
      <div className="flex">
        <img
          className="ml-[16.51px] h-[70.062px] w-[71,123px] rounded-full"
          src={data.profile}
          alt="copy url"
          width={81}
          height={81}
        />
        <div className="mt-[6px] flex h-[36px] w-screen flex-col">
          <div className="ml-[16px] h-[36px] text-[24px] font-bold leading-9 tracking-[0.72px]">
            {data.nickname}
          </div>
          <div className="flex">
            <div className="ml-[16px] h-[18px] whitespace-nowrap rounded-[4px] bg-[#EEE] px-1 py-[1px] text-center text-[12px] font-medium leading-[18px]">
              {data.petName}
            </div>
            <img src={dot} className="mx-1" />
            <div className="mr-[21px] h-[18px] overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[18px]">
              {year}/{data.breedName}
            </div>
          </div>
        </div>
      </div>
      <div
        className="mx-[21px] mt-[20px] justify-center rounded-[17px] border-[1px] border-solid border-[#ECE5FF] bg-[#F3EEFF] py-[7px] text-center text-sm font-medium text-[#4725A7]"
        onClick={mapButtonHandler}
      >
        {isMyAccount ? '프로필공유' : '지도보기'}
      </div>
    </div>
  );
}

export default PetInfo;
