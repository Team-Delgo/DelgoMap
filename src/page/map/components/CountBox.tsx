import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { getCerts } from '../../../common/api/record';
import dogfoot from '../../../common/icons/dogfoot-small-black.svg';
import dot from '../../../common/icons/dot.svg';
import eye from '../../../common/icons/eye-black.svg';

interface Props {
  viewCount: number;
}

function CountBox({ viewCount }: Props) {
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const { data: userInfo } = useQuery(['getUserInfo', userId], () => getCerts(userId));
  return (
    <div className="flex w-screen justify-center">
      <div className="absolute bottom-[90px] z-[100] flex items-center rounded-[45px] bg-[#FFF] px-[15px] py-[8px] text-[12px] font-bold shadow-1">
        <img src={dogfoot} />
        {userInfo && <div className="ml-[4px] text-[#000]">{userInfo.totalCount}</div>}
        <img src={dot} className="mx-[6px]" />
        <img src={eye} />
        {userInfo && (
          <div className="ml-[4px] text-[12px] font-bold text-[#000]">{viewCount}</div>
        )}
      </div>
    </div>
  );
}
export default CountBox;
