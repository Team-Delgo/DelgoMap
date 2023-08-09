import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DogFoot from '../../../common/icons/dogfoot.svg';
import HelpFloatingMessage from '../../../components/HelpFloatingMessage';
import { RootState } from '../../../redux/store';

function CertToggle(props: { onClick: () => void; state: boolean }) {
  const { onClick, state } = props;
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const selectedLat = useSelector((state: RootState) => state.map.selectedId.lat);

  useEffect(() => {
    const isFirstCert = window.localStorage.getItem('isFirstCert');
    const isFirstToggle = window.localStorage.getItem('isFirstToggle');

    if (isFirstCert) {
      if (!isFirstToggle) {
        setShow(true);
      }
    }
  }, []);

  const onClickHandler = () => {
    if (!isDisabled) {
      onClick();
      setShow(false);
      window.localStorage.setItem('isFirstToggle', 'true');
      setIsDisabled(true);
      setTimeout(() => setIsDisabled(false), 100);
    }
  };
  return (
    <div>
      <div
        className="absolute bottom-[140px] right-[20px] z-[100] flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white shadow-1"
        aria-hidden="true"
        onClick={onClickHandler}
      >
        {show && selectedLat === 0 && (
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
