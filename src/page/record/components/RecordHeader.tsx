import classNames from 'classnames';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './RecordHeader.scss';
import PetInfo from './PetInfo';
import BackArrow from '../common/icons/prev-arrow-black.svg';
import { ROOT_PATH } from '../../../common/constants/path.const';
import { RootState } from '../../../redux/store';
import PageHeader from '../../../components/PageHeader';
import useMap from '../../map/index.hook';
import FooterNavigation from 'components/FooterNavigation';

interface Pet {
  petId: number;
  petName: string;
  breedName: string;
  birthday: string;
}

function RecordHeader() {
  const {
    action: { setCurrentMapLocation },
  } = useMap();

  let tab = (useLocation().state as any) || 'photo';
  if (tab.from === 'home') {
    tab = 'photo';
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

  return (
    <div className={classNames('recordHeader-wrapper', { fixed: tab === 'calendar' })}>
      {/* <div className='recordHeader-header'>
        <img className='recordHeader-header-back' src={BackArrow} alt="back" aria-hidden="true" onClick={backButtonClickHandler}/>
        <div className="recordHeader-header-title">내 기록</div>
      </div> */}
      <PageHeader navigate={() => navigate(ROOT_PATH)} title="" short />
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
          활동
        </div>
        <div className="recordHeader-divider" />
        <div className="absolute mt-[700px] w-[100%]">
          <FooterNavigation setCenter={setCurrentMapLocation} />
        </div>
      </div>
    </div>
  );
}

export default RecordHeader;
