import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { UserProfile } from '../../../common/types/user';

function PetInfo() {
  const { pet } = useSelector((state: RootState) => state.persist.user);
  const year = `${(new Date().getFullYear() - parseInt(pet.birthday)).toString()}` + `살`;

  return (
    <header className=" fixed z-20 mt-[80px] flex w-screen bg-white">
      <img
        className="ml-[16.51px] h-[82.246px] w-[83.492px] rounded-full"
        src={pet.image}
        alt="copy url"
        width={81}
        height={81}
      />
      <div className="flex h-[36px] w-screen flex-col">
        <div className="flex">
          <div className="ml-[21px] h-[36px] text-[24px] font-bold leading-9 tracking-[0.72px]">
            {pet.name}
          </div>
          <div className="ml-[12px] mt-[9px] h-[18px] text-[12px] font-normal leading-[18px]">
            {year} {pet.breedName}
          </div>
        </div>
        <div className="ml-[12px] mr-[20px] mt-[6px] justify-center rounded-[17px] border-[1px] border-solid border-[#ECE5FF] bg-[#F3EEFF] py-[7px] text-center text-sm font-medium text-[#4725A7]">
          지도보기
        </div>
      </div>
    </header>
  );
}

export default PetInfo;
