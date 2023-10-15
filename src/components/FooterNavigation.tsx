import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import {
  RECORD_PATH,
  SIGN_IN_PATH,
  POSTS_PATH,
  UPLOAD_PATH,
} from '../common/constants/path.const';
import AlertConfirm from '../common/dialog/AlertConfirm';
import DogFootEmpty from '../common/icons/dogfoot-empty.svg';
import DogFoot from '../common/icons/dogfoot-small-black.svg';
import Pin from '../common/icons/pin.svg';
import PinEmpty from '../common/icons/pin-empty.svg';
import Friends from '../common/icons/friends.svg';
import Plus from '../common/icons/plus.svg';
import FriendsEmpty from '../common/icons/friends-empty.svg';
import { uploadAction } from '../redux/slice/uploadSlice';
import { RootState } from '../redux/store';
import 'index.css';
import HelpFloatingMessage from './HelpFloatingMessage';
import { analytics } from '..';
import { userActions } from 'redux/slice/userSlice';

interface Props {
  page: string;
}

function FooterNavigation({ page }: Props) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const isFirstCert = useSelector((state: RootState) => state.persist.user.isFirstCert);
  const isFirstCertToggle = useSelector(
    (state: RootState) => state.persist.user.isFirstCertToggle,
  );
  const selectedId = useSelector((state: RootState) => state.map.selectedId.id);
  const clickEvent = useAnalyticsCustomLogEvent(analytics, 'cert-button-click');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const moveToPostsPage = () => {
    navigate(POSTS_PATH, { state: { cert: null, from: 'home' } });
  };
  const sendLoginPage = () => {
    navigate(SIGN_IN_PATH.MAIN);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  const recordButtonHandler = () => {
    if (userId) {
      navigate(`${RECORD_PATH.PHOTO}/${userId}`, {
        state: {
          prevPath: location.pathname,
        },
      });
    } else setIsAlertOpen(true);
  };

  const certButtonHandler = () => {
    clickEvent.mutate();
    if (userId) {
      if (isFirstCert) {
        dispatch(userActions.setIsFisrtCert(false));
        dispatch(userActions.setIsFirstCertToggle(true));
      }
      dispatch(uploadAction.initAchievements());
      navigate(UPLOAD_PATH.CERTIFICATION);
    } else setIsAlertOpen(true);
  };

  const pinButtonHandler = () => {
    navigate('/');
  };

  return (
    <div className="absolute bottom-0 z-[100] flex h-[63px] w-screen justify-evenly rounded-t-[18px] bg-white">
      {isFirstCert && selectedId > 0 && (
        <HelpFloatingMessage text="추억을 기록해보세요" guide="startCert" />
      )}
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={sendLoginPage}
          noButtonHandler={closeAlert}
        />
      )}
      <div
        className="mt-[8px] flex  flex-col items-center text-[11px] text-[#212122]"
        aria-hidden="true"
        onClick={moveToPostsPage}
      >
        <img className="mb-[4px] h-[20px] w-[20px]" src={page === 'friends' ? Friends : FriendsEmpty} alt="home" />
        친구들
      </div>
      <div
        className="mt-[8px] flex  flex-col items-center text-[11px] text-[#212122]"
        aria-hidden="true"
        onClick={pinButtonHandler}
      >
        <img
          className="mb-[4px] h-[20px] w-[20px]"
          src={page === 'map' ? Pin : PinEmpty}
          alt="home"
        />
        지도
      </div>
      <div
        className="mt-[8px] flex  flex-col items-center text-[11px] text-[#212122]"
        aria-hidden="true"
        onClick={certButtonHandler}
      >
        <img className="mb-[4px] h-[20px] w-[20px]" src={Plus} alt="home" />
        기록추가
      </div>
      <div
        className="mt-[8px] flex  flex-col items-center text-[11px] text-[#212122]"
        aria-hidden="true"
        onClick={recordButtonHandler}
      >
        <img className="mb-[4px] h-[20px] w-[20px]" src={page === 'record' ? DogFoot : DogFootEmpty} alt="home" />내 기록
      </div>
    </div>
  );
}

export default FooterNavigation;
