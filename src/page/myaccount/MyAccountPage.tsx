import React, { useCallback, useEffect, useState } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import './MyAccountPage.scss';
import LeftArrow from '../../common/icons/left-arrow.svg';
import RightArrow from '../../common/icons/right-arrow.svg';
import RightArrowGray from '../../common/icons/right-arrow-gray.svg';
import { MY_ACCOUNT_PATH, ROOT_PATH, SIGN_IN_PATH } from '../../common/constants/path.const';
import { RootState } from '../../redux/store';
import { userActions } from '../../redux/slice/userSlice';
import DeleteBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import {analytics} from "../../index";
import { logOut } from '../../common/api/myaccount';



const neighborRankingPageBodyStyle = { minHeight: window.innerHeight - 260 };

function MyAccountPage() {
  const dispatch = useDispatch();
  const { OS, device } = useSelector((state: RootState) => state.persist.device);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const pet = useSelector((state: RootState) => state.persist.user.pet);
  const user = useSelector((state: RootState) => state.persist.user.user);
  const { address, registDt } = user;
  const { name, image } = pet;
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'MyAccount',
        firebase_screen_class: 'MyAccountPage',
      },
    });
    window.scroll(0, 0);
  }, []);

  const moveToKakaoPlusFriend = useCallback(() => {
    if (OS === 'android') {
      window.BRIDGE.goToPlusFriends();
    } else {
      window.webkit.messageHandlers.goToPlusFriends.postMessage('');
    }
  },[])

  const logoutHandler = () => {
    if (device === 'mobile') {
      logOut(
        user.id,
        (response: AxiosResponse) => {
          const { code, codeMsg, data } = response.data;
          console.log('response',response)
          if (code === 200) {
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('refreshToken');
            dispatch(userActions.signout());
            navigate('/');
          }
        },
        dispatch,
      );
    } else {
      console.log('response')
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      dispatch(userActions.signout());
      navigate('/');
    }
  };

  return (
    <div className="my-account-page">
      <img
        aria-hidden="true"
        className="my-account-page-back"
        src={LeftArrow}
        alt="back"
        onClick={() => {
          navigate(ROOT_PATH);
        }}
      />
      <div className="my-account-page-title">??? ??????</div>
      <header className="my-account-page-header">
        <body className="my-account-page-header-my-pet">
          <img className="my-account-page-header-my-pet-img" src={image} alt="copy url" />
          <div className="my-account-page-header-my-pet-profile">
            <div className="my-account-page-header-my-pet-profile-name">
              {name}
              <img
                src={RightArrowGray}
                alt="right"
                aria-hidden="true"
                onClick={() => {
                  navigate(MY_ACCOUNT_PATH.PETINFO);
                }}
              />
            </div>
            <div className="my-account-page-header-my-pet-profile-address">{address}</div>
            <div className="my-account-page-header-my-pet-profile-date">???????????? {registDt}</div>
          </div>
        </body>
      </header>
      <body className="my-account-page-body" style={neighborRankingPageBodyStyle}>
        <div className="my-account-page-body-item" aria-hidden="true" onClick={() => { navigate(MY_ACCOUNT_PATH.USERINFO) }}>
          ????????? ??????
          <img src={RightArrow} alt="more" />
        </div>
        <div className="my-account-page-body-item" aria-hidden="true" onClick={() => { navigate(MY_ACCOUNT_PATH.SETTINGS) }}>
          ??????
          <img src={RightArrow} alt="more" />
        </div>
        <div className="my-account-page-body-item" aria-hidden="true" onClick={moveToKakaoPlusFriend}>
          <div className="my-account-page-body-item-wrapper">
            <div className="my-account-page-body-item-wrapper-title">??????</div>
            <div className="my-account-page-body-item-wrapper-sub">????????? ?????????????????? ??????</div>
          </div>
          <img src={RightArrow} alt="more" />
        </div>
        <div
          className="my-account-page-body-item"
          aria-hidden="true"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          ????????????
          <img src={RightArrow} alt="more" />
        </div>
      </body>
      <DeleteBottomSheet 
        text="???????????? ???????????????????"
        description=""
        cancelText="??????"
        acceptText="????????????"
        acceptButtonHandler={logoutHandler}
        cancelButtonHandler={() => {
          setModalOpen(false);
        }}
        bottomSheetIsOpen={modalOpen}
      />
    </div>
  );
}

export default MyAccountPage;
