import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import DogFoot from '../../../common/icons/dogfoot.svg';
import './CertToggle.scss';
import HelpFloatingMessage from '../../../components/HelpFloatingMessage';

function CertToggle(props: { onClick: () => void; state: boolean }) {
  const { onClick, state } = props;
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isFirstCert = window.localStorage.getItem('isFirstCert');
    const isFirstToggle = window.localStorage.getItem('isFirstToggle');

    if (isFirstCert) {
      console.log(1);
      if (!isFirstToggle) {
        console.log(2);
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
    <div className="certtoggle-wrapper">
      <div
        className={classNames('certtoggle', { off: !state })}
        aria-hidden="true"
        onClick={onClickHandler}
      >
        {show && <HelpFloatingMessage
          text="내 기록을 지도에서 확인 할 수 있어요"
          direction="right"
        />}
        <img src={DogFoot} alt="toggle" />
      </div>
    </div>
  );
}

export default CertToggle;
