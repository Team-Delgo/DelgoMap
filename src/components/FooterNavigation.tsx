import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { CROP_PATH, RECORD_PATH, SIGN_IN_PATH, POSTS_PATH, UPLOAD_PATH } from '../common/constants/path.const';
import AlertConfirm from '../common/dialog/AlertConfirm';
import DogFoot from '../common/icons/dogfoot.svg';
import Home from "../common/icons/home.svg";
import Plus from '../common/icons/plus.svg';
import { uploadAction } from '../redux/slice/uploadSlice';
import { RootState } from '../redux/store';
import './FooterNavigation.scss';
import HelpFloatingMessage from './HelpFloatingMessage';
import { analytics } from '..';

function FooterNavigation(props: { setCenter: () => void }) {
  const { setCenter } = props;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [helpShow, setHelpShow] = useState(false);
  const device = useSelector((state: RootState) => state.persist.device.OS);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const selectedId = useSelector((state:RootState) => state.map.selectedId.id);
  const clickEvent = useAnalyticsCustomLogEvent(analytics, "cert-button-click");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const moveToPostsPage = () => {
    setCenter();
    navigate(POSTS_PATH , {state:{cert:null, from:'home'}});
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
      // setCenter();
      // openFileGallery();
      dispatch(uploadAction.initAchievements());
      navigate(UPLOAD_PATH.CERTIFICATION)
    } else setIsAlertOpen(true);
  };

  useEffect(()=>{
    const isFirstTime = localStorage.getItem('isFirstCert');
    if(!isFirstTime) setHelpShow(true);
  },[]);

  return (
    <div className={classNames("navigation", {ios:device==="ios"})}>
      {(helpShow && selectedId > 0) && <HelpFloatingMessage text='추억을 기록해보세요' direction='bottom'/>}
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={sendLoginPage}
          noButtonHandler={closeAlert}
        />
      )}
      <div className="navigation-button" aria-hidden="true" onClick={moveToPostsPage}>
        <img src={Home} alt="home" />
        동네강아지
      </div>
      <div className="navigation-plus" aria-hidden="true" onClick={certButtonHandler}>
        <img src={Plus} alt="plus" />
      </div>
      <div className="navigation-button" aria-hidden="true" onClick={recordButtonHandler}>
        <img src={DogFoot} alt="foot" />내 기록
      </div>
    </div>
  );
}

export default FooterNavigation;
