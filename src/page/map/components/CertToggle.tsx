import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DogFoot from '../../../common/icons/dogfoot.svg';
import HelpFloatingMessage from '../../../components/HelpFloatingMessage';
import { RootState } from '../../../redux/store';
import { userActions } from 'redux/slice/userSlice';

function CertToggle(props: { onClick: () => void; state: boolean }) {
  const { onClick, state } = props;
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useDispatch();
  const selectedLat = useSelector((state: RootState) => state.map.selectedId.lat);
  const isFirstCertToggle = useSelector((state:RootState) => state.persist.user.isFirstCertToggle);
  // useEffect(() => {
  //   const isFirstCert = window.localStorage.getItem('isFirstCert');
  //   const isFirstToggle = window.localStorage.getItem('isFirstToggle');

  //   if (isFirstCert) {
  //     if (!isFirstToggle) {
  //       setShow(true);
  //     }
  //   }
  // }, []);

  const onClickHandler = () => {
    onClick();
    dispatch(userActions.setIsFirstCertToggle(false));
  };

  return (
    <div>
      <div
        className="absolute bottom-[140px] right-[20px] z-[100] flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white shadow-1"
        aria-hidden="true"
        onClick={onClickHandler}
      >
        {isFirstCertToggle && selectedLat === 0 && (
          <HelpFloatingMessage
            text="내 기록을 지도에서 확인 할 수 있어요"
            guide="viewCert"
          />
        )}
        <img
          src={DogFoot}
          alt="toggle"
          className={`h-[20px] w-[20px] ${!state && 'opacity-30'}`}
        />
      </div>
    </div>
  );
}

export default CertToggle;
