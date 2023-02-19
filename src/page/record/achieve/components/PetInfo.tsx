import React from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfileInfo } from '../../../../common/api/myaccount';
import { useErrorHandlers } from '../../../../common/api/useErrorHandlers';
import { CACHE_TIME, GET_MY_PROFILE_INFO_DATA, STALE_TIME } from '../../../../common/constants/queryKey.const';
import Loading from '../../../../common/utils/Loading';
import { RootState } from '../../../../redux/store';

function PetInfo() {
  const dispatch = useDispatch();
  const { pet, user } = useSelector((state: RootState) => state.persist.user);

  const { isLoading: getMyProfileInfoDataIsLoading, data: getMyProfileInfoData } = useQuery(
    GET_MY_PROFILE_INFO_DATA,
    () => getMyProfileInfo(user.id),
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  if (getMyProfileInfoDataIsLoading) {
    return <Loading />;
  }


  return (
    <header className="pet-info-container">
      <img className="pet-info-img" src={pet.image} alt="copy url" width={81} height={81} />
      <div className="pet-info-name">{pet.name}</div>
      <div className="pet-info-birth-day">{pet.birthday}</div>
      <div className="pet-history-info-wrapper">
        <div>
          <div className="pet-history-info-first-line">내 포인트</div>
          <div className="pet-history-info-second-line">{getMyProfileInfoData?.data?.user?.point?.accumulatedPoint}</div>
        </div>
        <div>
          <div className="pet-history-info-first-line">멍플기록</div>
          <div className="pet-history-info-second-line">{getMyProfileInfoData?.data?.mungpleCount}</div>
        </div>
        <div>
          <div className="pet-history-info-first-line">전체기록</div>
          <div className="pet-history-info-second-line">{getMyProfileInfoData?.data?.totalCount}</div>
        </div>
      </div>
    </header>
  );
}

export default PetInfo;
