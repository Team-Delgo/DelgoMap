import React, { useEffect,  useState } from 'react';
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
import DogFoot from '../common/icons/dogfoot.svg';
import Home from '../common/icons/home.svg';
import Plus from '../common/icons/plus.svg';
import { uploadAction } from '../redux/slice/uploadSlice';
import { RootState } from '../redux/store';
import 'index.css';
import HelpFloatingMessage from './HelpFloatingMessage';
import { analytics } from '..';

function FooterNavigation(props: { setCenter: () => void }) {
  const { setCenter } = props;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [helpShow, setHelpShow] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const selectedId = useSelector((state: RootState) => state.map.selectedId.id);
  const clickEvent = useAnalyticsCustomLogEvent(analytics, 'cert-button-click');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const moveToPostsPage = () => {
    if (userId) {
      setCenter();
      navigate(POSTS_PATH, { state: { cert: null, from: 'home' } });
    }
    else{
      setIsAlertOpen(true);
    }
  };
  const sendLoginPage = () => {
    navigate(SIGN_IN_PATH.MAIN);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  const recordButtonHandler = () => {
    if (userId) {
      setCenter();
      navigate(RECORD_PATH.PHOTO);
    } else setIsAlertOpen(true);
  };

  const certButtonHandler = () => {
    clickEvent.mutate();
    if (userId) {
      dispatch(uploadAction.initAchievements());
      navigate(UPLOAD_PATH.CERTIFICATION);
    } else setIsAlertOpen(true);
  };

  useEffect(() => {
    const isFirstTime = localStorage.getItem('isFirstCert');
    if (!isFirstTime) setHelpShow(true);
  }, []);

  return (
    <div className="absolute bottom-0 z-[100] flex h-[63px] w-screen justify-evenly rounded-t-[18px] bg-white">
      {helpShow && selectedId > 0 && (
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
        className="mt-[8px] flex  flex-col items-center pl-[40px] pr-[40px] text-[11px] text-[#212122]"
        aria-hidden="true"
        onClick={moveToPostsPage}
      >
        <img className="mb-[4px] h-[20px] w-[20px]" src={Home} alt="home" />
        동네강아지
      </div>
      <div
        className="absolute top-[-9px] flex h-[65px] w-[65px] items-center justify-center rounded-full bg-[#212122] shadow-1"
        aria-hidden="true"
        onClick={certButtonHandler}
      >
        <img src={Plus} alt="plus" />
      </div>
      <div
        className="mt-[8px] flex  flex-col items-center pl-[40px] pr-[40px] text-[11px] text-[#212122]"
        aria-hidden="true"
        onClick={recordButtonHandler}
      >
        <img className="mb-[4px] h-[20px] w-[20px]" src={DogFoot} alt="foot" />내 기록
      </div>
    </div>
  );
}

export default FooterNavigation;
