import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../../../redux/slice/userSlice';
import { ROOT_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from '../../../../common/constants/path.const';
import { setStateCode } from '../../../../common/api/social';
import AlertConfirm from '../../../../common/dialog/AlertConfirm';
import AlertConfirmOne from '../../../../common/dialog/AlertConfirmOne';
import Loading from '../../../../common/utils/BallLoading';
import { RootState } from '../../../../redux/store';

declare global {
  interface Window {
    Naver: any;
  }
}

function NaverRedirectHandler() {
  const dispatch = useDispatch();
  const code = new URL(window.location.href).searchParams.get('code'); // 네이버 로그인 인증에 성공하면 반환받는 인증 코드, 접근 토큰(access token) 발급에 사용
  const state = new URL(window.location.href).searchParams.get('state');
  const [userData, setUserData] = useState({ phone: '', email: '' });
  const [signUp, setSignUp] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();
  const { OS, device } = useSelector((state: RootState) => state.persist.device);

  useEffect(() => {
    setStateCode(
      { code, state },
      (response: AxiosResponse) => {
        console.log(response);
        const { code, data } = response.data;
        if (code === 200) {
          const { registDt } = data;
          console.log('로그인 성공');
          dispatch(
            userActions.signin({
              isSignIn: true,
              user: {
                id: data.userId,
                address: data.address,
                nickname: data.name,
                email: data.email,
                phone: data.phoneNo,
                isSocial:true,
                registDt: `${registDt.slice(0, 4)}.${registDt.slice(5, 7)}.${registDt.slice(8, 10)}`,
                userSocial: data.userSocial,
                geoCode: data.geoCode,
                notify:data.notify,
              },
              pet: {
                petId: data.petId,
                birthday: data.birthday,
                breed: data.breed,
                breedName: data.breedName,
                name: data.petName,
                image: data.profile,
              },
            }),
          );
          const accessToken = response.headers.authorization_access;
          const refreshToken = response.headers.authorization_refresh;
          localStorage.setItem('accessToken', accessToken || '');
          localStorage.setItem('refreshToken', refreshToken || '');
          if (device === 'mobile') {
            sendFcmTokenHandler(data.user.userId);
          }
          navigate(ROOT_PATH, { replace: true });
        } else if (code === 370) {
          console.log('소셜 회원가입');
          setUserData({ phone: data.phoneNo, email: data.email });
          setSignUp(true);

        } else if (code === 380) {
          console.log('네이버 전화번호 x');
          navigate(SIGN_UP_PATH.SOCIAL.NO_PHONE, { state: { social: '네이버' } });

        } else if (code === 381) {
          console.log('다른 로그인');
          console.log(data.userSocial);
          navigate(SIGN_UP_PATH.SOCIAL.OTHER, { state: { social: data.userSocial, email: data.email } });

        } else {
          console.log('네이버 가입 에러');
          setLoginFailed(true);

        }
      },
      () => { navigate(SIGN_IN_PATH.MAIN) },
      dispatch,
    );
  }, []);

  const sendFcmTokenHandler = (userId: number) => {
    if (OS === 'android') {
      window.BRIDGE.sendFcmToken(userId);
    }
    else{
      window.webkit.messageHandlers.sendFcmToken.postMessage(userId);
    }
  };

  const moveToPreviousPage = () => {
    navigate('/user/signin');
  };

  const moveToSignUpPage = () => {
    navigate(SIGN_UP_PATH.TERMS, { state: { isSocial: 'N', phone: userData.phone, email: userData.email } });
  };

  return (
    <div>
      <Loading />
      {signUp && (
        <AlertConfirm
          text="네이버로 가입된 DELGO계정이 없습니다"
          buttonText="회원가입"
          yesButtonHandler={moveToSignUpPage}
          noButtonHandler={moveToPreviousPage}
        />
      )}
      {loginFailed && <AlertConfirmOne text="네이버 로그인에 실패하였습니다" buttonHandler={moveToPreviousPage} />}
    </div>
  );
}

export default NaverRedirectHandler;
