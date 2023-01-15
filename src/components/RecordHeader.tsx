import classNames from 'classnames';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RecordHeader.scss';

function RecordHeader() {
  let tab = (useLocation().state as any) || 'photo';
  if (tab.from === 'home') {
    tab = 'photo';
  }
  const [selected, setSeleceted] = useState({
    photo: false,
    calendar: true,
    map: false,
  });
  const navigate = useNavigate();

  const clickHandler = (e: any) => {
    const { id } = e.target;
    if (tab === id) return;
    setSeleceted((prev) => {
      const temp = {
        photo: false,
        calendar: false,
        map: false,
      };
      return { ...temp, [id]: true };
    });
    navigate(`/${id}`, { state: id });
  };
  return (
    <div className={classNames('recordHeader-wrapper', { fixed: tab === 'calendar' })}>
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
          id="map"
          className={classNames('recordHeader-item', { select: tab === 'map' })}
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
