import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import Arrow  from '../../../common/icons/left-arrow.svg';
import ToastMessage from '../../../common/dialog/ToastMessage';
import Timer from '../signup/phone/Timer';
import { phoneCheckNumber, phoneSendMessage, phoneSendMessageForFind } from '../../../common/api/signup';
import { SIGN_IN_PATH, SIGN_UP_PATH } from '../../../common/constants/path.const';
import { errorActions } from '../../../redux/slice/errorSlice';
import './PhoneAuth.scss';

interface LocationState {
  phone: string;
  email: string;
  isSocial: string;
  socialId: string;
}

function PhoneAuth() {
  const dispatch = useDispatch();
  const [timeIsValid, setTimeIsValid] = useState(true);
  const [SMSid, setSMSid] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isReSended, setIsReSended] = useState(false);
  const [buttonIsClicked, setButtonIsClicked] = useState(true);
  const [authNumber, setAuthNumber] = useState('');
  const [authFailed, setAuthFailed] = useState(false);
  const authRef = useRef<any>();
  const state = useLocation().state as LocationState;
  const { phone, email, isSocial, socialId } = state;
  const authIsValid = timeIsValid && authNumber.length === 4;
  const navigation = useNavigate();


  useEffect(() => {
    if (buttonIsClicked) {
      authNumberResend();
      setTimeout(() => {
        setButtonIsClicked(false);
      }, 2500);
    }
  }, [buttonIsClicked]);

  const errorHandler = () => {
    dispatch(errorActions.setError());
  };

  const authNumberResend = () => {
    if (isSocial) {
      phoneSendMessage(
        phone,
        (response: AxiosResponse) => {
          const { code, data } = response.data;
          if (code === 200) {
            setSMSid(data);
            setButtonIsClicked(true);
            setTimeIsValid(true);
            setIsReSended(true);
          } else {
            console.log('network error!');
          }
        },
        errorHandler,
      );
    } else {
      phoneSendMessageForFind(
        phone,
        (response: AxiosResponse) => {
          const { code, data } = response.data;
          console.log(response);
          if (code === 200) {
            setSMSid(data);
            setIsReSended(true);
            setButtonIsClicked(true);
            setTimeIsValid(true);
          }
        },
        errorHandler,
      );
    }
    //  ???????????? ?????? ??????
  };

  const resetIsResend = () => {
    setIsReSended(false);
  };

  const inputChangeHannler = (e: ChangeEvent<HTMLInputElement>) => {
    if (authNumber.length === 4 && e.target.value.length > 4) return;
    setAuthNumber(e.target.value);
    setFeedback('');
  };

  const submitAuthNumber = () => {
    console.log(isSocial);
    phoneCheckNumber(
      { number: authNumber, smsId: SMSid },
      (response: AxiosResponse) => {
        const { code } = response.data;
        console.log(response);
        if (code === 200) {
          if (isSocial) {
            console.log(isSocial);
            navigation(SIGN_UP_PATH.SOCIAL.NICKNAME, { state: { phone, isSocial, email, socialId } });
          } else {
            navigation(SIGN_IN_PATH.RESETPASSWORD, { state: email });
          }
        } else {
          setFeedback('??????????????? ??????????????????');
          setAuthFailed(true);
          authRef.current.focus();
        }
      },
      errorHandler,
    );
  };

  return (
    <div className="login">
      <div aria-hidden="true" className="login-back" onClick={() => navigation(-1)}>
        <img src={Arrow} alt="arrow" />
      </div>
      <header className="login-header">???????????? ??????</header>
      <div className="login-description longmargin">
        ????????? ????????? ????????? ??????????????? ?????????????????????.
        <br />
        ??????????????? ??????????????????.
      </div>
      <div className="login-input-box">
        <input
          type="number"
          ref={authRef}
          className={classNames('login-input findauthnum', { invalid: feedback.length })}
          placeholder="????????????"
          value={authNumber}
          autoComplete="off"
          onChange={inputChangeHannler}
        />
        <span className="login-timer reset">
          <Timer isResend={isReSended} resendfunc={resetIsResend} setInValid={() => setTimeIsValid(false)} />
        </span>
        <p className="input-feedback">{feedback}</p>
        <p aria-hidden="true" className="login-authnumber-resend" onClick={authNumberResend}>
          ???????????? ?????????
        </p>
      </div>

      <button
        type="button"
        className={classNames('login-button', { active: authIsValid })}
        disabled={!authIsValid}
        onClick={submitAuthNumber}
      >
        ??????
      </button>
    </div>
  );
}

export default PhoneAuth;
