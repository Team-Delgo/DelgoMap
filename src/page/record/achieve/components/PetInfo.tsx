import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { UserProfile } from '../../../../common/types/user';

interface myProfileInfoDataType {
  address: string;
  birthday: string;
  breedName: string;
  ca0001Count: number;
  ca0002Count: number;
  ca0003Count: number;
  ca0004Count: number;
  ca0005Count: number;
  ca0006Count: number;
  ca0007Count: number;
  ca9999Count: number;
  email: string;
  isNotify: true;
  petId: number;
  petName: string;
  phoneNo: string;
  profile: string;
  registDt: string;
  totalCount: number;
  totalCountByMungple: number;
  userId: number;
  userName: string;
  userSocial: string;
}

interface petInfoPropsType {
  myProfileInfoData: myProfileInfoDataType;
}

function PetInfo({ myProfileInfoData }: petInfoPropsType) {
  const { pet } = useSelector((state: RootState) => state.persist.user);

  return (
    <header className="pet-info-container">
      <div className="pet-info-img-wrapper">
      <img
        className="pet-info-img"
        src={pet.image}
        alt="copy url"
        width={81}
        height={81}
      />
      </div>
      <div className="pet-info-name">{pet.name}</div>
      <div className="pet-info-birth-day">{pet.birthday}</div>
      <div className="pet-history-info-wrapper">
        <div>
          <div className="pet-history-info-first-line">내 포인트</div>
          <div className="pet-history-info-second-line">
            {/* {myProfileInfoData?.user?.point?.accumulatedPoint} */}
            0
          </div>
        </div>
        <div>
          <div className="pet-history-info-first-line">멍플기록</div>
          <div className="pet-history-info-second-line">
            {myProfileInfoData?.totalCountByMungple}
          </div>
        </div>
        <div>
          <div className="pet-history-info-first-line">전체기록</div>
          <div className="pet-history-info-second-line">
            {myProfileInfoData?.totalCount}
          </div>
        </div>
      </div>
    </header>
  );
}

export default PetInfo;
