import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import './SignIn.scss';
import { useAnalyticsLogEvent, useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { AxiosError, AxiosResponse } from 'axios';
import AppleLogin from 'react-apple-login';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import KakaoButton from '../../../common/icons/kakao.svg';
import Naver from '../../../common/icons/naver.svg';
import { analytics } from '../../../index';
import Apple from '../../../common/icons/apple.svg';
import { ROOT_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from '../../../common/constants/path.const';
import { KAKAO, NAVER } from '../../../common/constants/url.cosnt';
import { checkEmail } from '../validcheck';
import Arrow from '../../../common/icons/left-arrow.svg';
import { emailAuth } from '../../../common/api/login';
import Loading from '../../../common/utils/Loading';
import AppleLoginButton from './social/AppleLogin';
import { useErrorHandlers } from '../../../common/api/useErrorHandlers';

declare global {
  interface Window {
    BRIDGE: any;
    webkit: any;
    Kakao: any;
  }
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const signUpStartEvent = useAnalyticsCustomLogEvent(analytics, 'delgo_signup_start');

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'SignIn',
        firebase_screen_class: 'SignInPage',
      },
    });
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      navigate('/');
    }
    setTimeout(() => {
      setLoading(false);
    }, 700);
  }, []);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    const response = checkEmail(value);
    setFeedback(response.message);
  };

  const emailCheck = useMutation(() => emailAuth(email), {
    onSuccess: (data) => {
      if (data.data.code === 200) navigate(SIGN_IN_PATH.SIGNIN, { state: { email } });
      else setFeedback('가입되지 않은 이메일입니다.');
    },
    onError: (error: AxiosError) => {
      useErrorHandlers(dispatch, error);
    }
  });

  const buttonClickHandler = () => {
    emailCheck.mutate();
  };

  const signupButtonClick = () => {
    signUpStartEvent.mutate();
    navigate(SIGN_UP_PATH.TERMS, { state: { isSocial: false } });
  };

  const kakaoIntentUrl = `intent://${KAKAO.KAKAO_AUTH_URL.replace(
    /https?:\/\//i,
    '',
  )}#Intent;scheme=http;package=com.android.chrome;end`;

  return (
    <div className="login-signin">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div aria-hidden="true" className="login-back" onClick={() => navigate(ROOT_PATH)}>
            <img src={Arrow} alt="arrow" />
          </div>
          <div className="login-title-wrapper">
            <div className="login-title1">우리집 강아지도</div>
            <div className="login-title2">델고가요</div>
            <div className="login-subtitle">강아지와의 활동을 기록해요</div>
          </div>
          <div className="login-input-flex">
            <div className="login-input-box">
              <input
                placeholder="이메일"
                autoComplete="off"
                onChange={inputChangeHandler}
                value={email}
                ref={emailRef}
                className={classNames('login-input email', { invalid: feedback.length })}
              />
              <p className="login-feedback">{feedback}</p>
            </div>

            <button type="button" className="login-button active signup" onClick={buttonClickHandler}>
              계속
            </button>
            <div className="login-signup-wrapper">
              <div aria-hidden="true" className="login-signup-text" onClick={signupButtonClick}>
                회원가입
              </div>
            </div>
            <div className="login-social-header">소셜 로그인</div>
            <div className="login-social">
              <div
                aria-hidden="true"
                onClick={() => {
                  window.Kakao.Auth.authorize({
                    redirectUri: `${process.env.REACT_APP_BASE_URL}/oauth/callback/kakao`,
                  });
                }}
              >
                <button type="button" className="login-kakao">
                  <img src={KakaoButton} alt="kakaobutton" className="icon" />
                </button>
              </div>
              <a href={NAVER.NAVER_AUTH_URL}>
                <button type="button" className="login-naver">
                  <img src={Naver} alt="naver" className="icon" />
                </button>
              </a>
              <div className="login-apple">
                <img src={Apple} alt="apple" className="icon" />
                <AppleLoginButton />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SignIn;
