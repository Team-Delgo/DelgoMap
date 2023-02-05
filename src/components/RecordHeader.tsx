import classNames from 'classnames';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RecordHeader.scss';
import BackArrow from "../common/icons/back-arrow.svg";
import { ROOT_PATH } from '../common/constants/path.const';

function RecordHeader() {
  let tab = (useLocation().state as any) || 'calendar';
  if (tab.from === 'home') {
    tab = 'calendar';
  }
  const [selected, setSeleceted] = useState({
    photo: false,
    calendar: true,
    achieve: false,
  });
  const navigate = useNavigate();

  const clickHandler = (e: any) => {
    const { id } = e.target;
    if (tab === id) return;
    setSeleceted((prev) => {
      const temp = {
        photo: false,
        calendar: false,
        achieve: false,
      };
      return { ...temp, [id]: true };
    });
    navigate(`/${id}`, { state: id });
  };

  const backButtonClickHandler = () => {
    navigate(ROOT_PATH);
  };

  return (
    <div className={classNames('recordHeader-wrapper', { fixed: tab === 'calendar' })}>
      <div className='recordHeader-header'>
        <img className='recordHeader-header-back' src={BackArrow} alt="back" aria-hidden="true" onClick={backButtonClickHandler}/>
        <div className="recordHeader-header-title">내 기록</div>
      </div>
      <div className="recordHeader">
        <div
          aria-hidden="true"
          id="photo"
          className={classNames('recordHeader-item', { select: tab === 'photo' })}
          onClick={clickHandler}
        >
          앨범
        </div>
        <div
          aria-hidden="true"
          id="calendar"
          className={classNames('recordHeader-item', { select: tab === 'calendar' })}
          onClick={clickHandler}
        >
          달력
        </div>
        <div
          aria-hidden="true"
          id="achieve"
          className={classNames('recordHeader-item', { select: tab === 'achieve' })}
          onClick={clickHandler}
        >
          업적
        </div>
      </div>
      <div className="recordHeader-divider" />
    </div>
  );
}

export default RecordHeader;
