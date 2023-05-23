import React, { useState, ChangeEvent, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { AxiosError, AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { userActions } from '../../../redux/slice/userSlice';
import Arrow from '../../../common/icons/left-arrow.svg';
import ToastMessage from '../../../common/dialog/ToastMessage';
import { login } from '../../../common/api/login';
import './Login.scss';
import { checkEmail, checkPasswordLogin } from '../validcheck';
import Loading from '../../../common/utils/BallLoading';
import { ROOT_PATH } from '../../../common/constants/path.const';
import { analytics } from "../../../index";
import { RootState } from '../../../redux/store';
import { useErrorHandlers } from '../../../common/api/useErrorHandlers';

interface Input {
  email: string;
  password: string;
}

interface State {
  email: string;
}


declare global {
  interface Window {
    BRIDGE: any;
    webkit: any;
    kakao: any;
  }
}

function Login() {
  const [enteredInput, setEnteredInput] = useState<Input>({ email: '', password: '' });
  const [loginFailed, setLoginFailed] = useState(false);
  const [feedback, setFeedback] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const state = useLocation().state as State;
  const { email } = state;
  const { OS, device } = useSelector((state: RootState) => state.persist.device);

  const mutation = useAnalyticsLogEvent(analytics, "screen_view");

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: "SignIn-Password",
        firebase_screen_class: "SignInPasswordPage"
      }
    });
  }, []);

  const enterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      loginButtonHandler();
    }
  };

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === 'email') {
      const response = checkEmail(value);
      setFeedback((prev: Input) => {
        return { ...prev, email: response.message };
      });
    } else if (id === 'password') {
      const response = checkPasswordLogin(value);
      setFeedback((prev: Input) => {
        return { ...prev, password: response.message };
      });
    }
    setEnteredInput((prev: Input) => {
      return { ...prev, [id]: value };
    });
  };

  const loginMutate = useMutation(() => login({ email, password: enteredInput.password }), {
    onSuccess: (response: AxiosResponse) => {
      const { code, data } = response.data;
      if (code === 200) {
        const { registDt } = data;
        setIsLoading(true);
        dispatch(
          userActions.signin({
            isSignIn: true,
            user: {
              id: data.userId,
              address: data.address,
              nickname: data.name,
              email: data.email,
              phone: data.phoneNo,
              isSocial: false,
              geoCode: data.geoCode,
              registDt: `${registDt.slice(0, 4)}.${registDt.slice(5, 7)}.${registDt.slice(8, 10)}`,
              notify: data.isNotify,
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
          sendFcmTokenHandler(data.userId);
        }
        navigation(ROOT_PATH, { replace: true });
      } else if (code === 304) {
        setIsLoading(false);
        setFeedback((prev) => {
          return { ...prev, password: '비밀번호를 확인하세요' };
        });
        setLoginFailed(true);
      }
    },
    onError: (error: AxiosError) => {
      useErrorHandlers(dispatch, error);
    }
  })

  const sendFcmTokenHandler = (userId: number) => {
    if (OS === 'android') {
      window.BRIDGE.sendFcmToken(userId);
    }
    else {
      // window.webkit.messageHandlers.sendFcmToken.postMessage(userId);
    }
  };

  const loginButtonHandler = () => {
    loginMutate.mutate();
  };

  useEffect(() => {
    if (loginFailed) {
      setTimeout(() => {
        setLoginFailed(false);
      }, 2500);
    }
  }, [loginFailed]);

  const findPassword = () => {
    navigation('/user/signin/findpassword');
  };

  return (
    <div className="login-signin">
      {/* {isLoading && <Loading />} */}
      <div aria-hidden="true" className="login-back" onClick={() => navigation(-1)}>
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
            className={classNames('login-input', { invalid: feedback.password.length })}
            placeholder="비밀번호"
            id="password"
            type="password"
            autoComplete="off"
            value={enteredInput.password}
            onChange={inputChangeHandler}
            onKeyDown={enterKey}
          />
          <p className="login-feedback">{feedback.password}</p>
        </div>

        <button type="button" className="login-button active loginpage" onClick={loginButtonHandler}>
          로그인
        </button>
        <div className="login-find_password" aria-hidden="true" onClick={findPassword}>
          비밀번호찾기
        </div>
      </div>
    </div>
  );
}

export default Login;
