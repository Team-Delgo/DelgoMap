import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessCode } from '../../../../common/api/social';
import { ROOT_PATH, SIGN_UP_PATH } from '../../../../common/constants/path.const';
import { userActions } from '../../../../redux/slice/userSlice';
import AlertConfirm from '../../../../common/dialog/AlertConfirm';
import AlertConfirmOne from '../../../../common/dialog/AlertConfirmOne';
import Loading from '../../../../common/utils/BallLoading';
import { RootState } from '../../../../redux/store';

declare global {
  interface Window {
    Kakao: any;
  }
}

function KakaoRedirectHandler() {
  const dispatch = useDispatch();
  const code = new URL(window.location.href).searchParams.get('code');
  const [userData, setUserData] = useState({ phone: '', email: '', id: '' });
  const [signUp, setSignUp] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();
  const { OS, device } = useSelector((state: RootState) => state.persist.device);

  useEffect(() => {
    if (code == null) {
      navigate('/user/signin');
    }
    getAccessToken();
  }, []);

  const getAccessToken = () => {
    setAccessCode(
      code,
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
                isSocial: true,
                registDt: `${registDt.slice(0, 4)}.${registDt.slice(5, 7)}.${registDt.slice(8, 10)}`,
                userSocial: data.userSocial,
                geoCode: data.geoCode,
                notify: data.notify,
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
          setUserData({ phone: data.phoneNo, email: data.email, id: data.socialId });
          setSignUp(true);
        } else if (code === 380) {
          console.log('카카오 전화번호 x');
          navigate(SIGN_UP_PATH.SOCIAL.NO_PHONE, { state: { social: '카카오' } });
        } else if (code === 381) {
          console.log('다른 로그인');
          navigate(SIGN_UP_PATH.SOCIAL.OTHER, { state: { social: data.userSocial, email: data.email } });
        } else {
          console.log('카카오 가입 에러');
          setLoginFailed(true);
        }
      },
      () => {
        console.log(1);
      },
      dispatch,
    );
  };

  const sendFcmTokenHandler = (userId: number) => {
    if (OS === 'android') {
      window.BRIDGE.sendFcmToken(userId);
    } else {
      window.webkit.messageHandlers.sendFcmToken.postMessage(userId);
    }
  };

  const moveToPreviousPage = () => {
    navigate('/user/signin');
  };

  const moveToSignUpPage = () => {
    navigate(SIGN_UP_PATH.TERMS, { state: { isSocial: 'K', phone: userData.phone, email: userData.email, socialId: userData.id } });
  };

  return (
    <div>
      <Loading />
      {signUp && (
        <AlertConfirm
          text="카카오로 가입된 계정이 없습니다"
          buttonText="회원가입"
          yesButtonHandler={moveToSignUpPage}
          noButtonHandler={moveToPreviousPage}
        />
      )}
      {loginFailed && <AlertConfirmOne text="카카오 로그인에 실패하였습니다" buttonHandler={moveToPreviousPage} />}
    </div>
  );
}

export default KakaoRedirectHandler;
