import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { UserProfile } from '../../../../common/types/user';

interface myProfileInfoDataType {
  mungpleCount: number;
  totalCount: number;
  user: UserProfile;
}

interface petInfoPropsType {
  myProfileInfoData: myProfileInfoDataType;
}

function PetInfo({ myProfileInfoData }: petInfoPropsType) {
  const { pet } = useSelector((state: RootState) => state.persist.user);

  return (
    <header className="pet-info-container">
      <img
        className="pet-info-img"
        src={pet.image}
        alt="copy url"
        width={81}
        height={81}
      />
      <div className="pet-info-name">{pet.name}</div>
      <div className="pet-info-birth-day">{pet.birthday}</div>
      <div className="pet-history-info-wrapper">
        <div>
          <div className="pet-history-info-first-line">내 포인트</div>
          <div className="pet-history-info-second-line">
            {myProfileInfoData?.user?.point?.accumulatedPoint}
          </div>
        </div>
        <div>
          <div className="pet-history-info-first-line">멍플기록</div>
          <div className="pet-history-info-second-line">
            {myProfileInfoData?.mungpleCount}
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
