import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import classNames from 'classnames';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { errorActions } from '../../../../redux/slice/errorSlice';
import ToastMessage from '../../../../common/dialog/ToastMessage';
import './VerifyPhone.scss';
import Timer from './Timer';
import { SIGN_UP_PATH } from '../../../../common/constants/path.const';
import Check from '../../../../common/icons/check.svg';
import Arrow from '../../../../common/icons/left-arrow.svg';
import Exit from '../../../../common/icons/x.svg';
import { phoneSendMessage, phoneCheckNumber } from '../../../../common/api/signup';

interface LocationState {
  isSocial: string;
}

function VerifyPhone() {
  const navigation = useNavigate();
  const state = useLocation().state as LocationState;
  const { isSocial } = state;
  const [buttonIsClicked, setButtonIsClicked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [isSended, setIsSended] = useState(false);
  const [timeIsValid, setTimeIsValid] = useState(true);
  const [isReSended, setIsReSended] = useState(false);
  const [feedback, setFeedback] = useState({ phone: '', auth: '' });
  const [SMSid, setSMSid] = useState(0);
  const [phoneIsExist, setPhoneIsExist] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const phoneRef = useRef<any>();
  const authRef = useRef<any>();

  const authIsValid = timeIsValid && authNumber.length === 4;
  const isValid = phoneNumber.length >= 12;
  const isEntered = phoneNumber.length > 0;

  const buttonClickHandler = () => {
    const phone: any =
      phoneNumber.slice(0, 3) + phoneNumber.slice(4, 8) + phoneNumber.slice(9, 13);
    console.log(phone, Number.isNaN(phone * 1));
    if (Number.isNaN(phone * 1)) {
      setFeedback({ phone: '잘못된 입력입니다.', auth: '' });
      phoneRef.current.focus();
      return;
    }
    setFeedback({ phone: '', auth: '' });
    phoneSendMessage(
      phone,
      (response: AxiosResponse) => {
        const { code, data } = response.data;
        if (code === 200) {
          setSMSid(data);
          setButtonIsClicked(true);
          setIsSended(true);
          setPhoneIsExist(false);
        } else {
          setPhoneIsExist(true);
          setFeedback({ phone: '이미 가입된 전화번호입니다.', auth: '' });
          phoneRef.current.focus();
        }
      },
      errorHandler,
    );
  };

  const dispatch = useDispatch();
  const errorHandler = () => {
    dispatch(errorActions.setError());
  };

  useEffect(() => {
    if (buttonIsClicked) {
      setTimeout(() => {
        setButtonIsClicked(false);
      }, 2500);
    }
  }, [buttonIsClicked]);

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (isSended) return;
    const { value } = event.target;
    // const onlyNumber = value.replace(/[^-0-9]/g, '');
    let temp = value;
    if (
      (value.length === 3 && phoneNumber.length === 2) ||
      (value.length === 8 && phoneNumber.length === 7)
    ) {
      temp = value.concat(' ');
    }

    if (
      (value.length === 9 && phoneNumber.length === 8) ||
      (value.length === 4 && phoneNumber.length === 3)
    ) {
      temp = `${phoneNumber} ${value.slice(-1)}`;
    }

    if (
      (value.length === 9 && phoneNumber.length === 10) ||
      (value.length === 4 && phoneNumber.length === 5)
    ) {
      temp = value.slice(0, -1);
    }

    if (phoneNumber.length === 13 && value.length > 13) return;
    setPhoneNumber(temp);
    setPhoneIsExist(false);
  };

  const clearButtonHandler = () => {
    if (isSended) return;
    setPhoneNumber('');
    setPhoneIsExist(false);
  };

  const authChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (authNumber.length === 4 && event.target.value.length > 4) return;
    setAuthNumber(event.target.value);
    setFeedback({ phone: '', auth: '' });
    setAuthFailed(false);
  };

  const authNumberResend = () => {
    const phone =
      phoneNumber.slice(0, 3) + phoneNumber.slice(4, 8) + phoneNumber.slice(9, 13);
    phoneSendMessage(
      phone,
      (response: AxiosResponse) => {
        const { code, data } = response.data;

        if (code === 200) {
          setSMSid(data);
          setIsReSended(true);
          setButtonIsClicked(true);
          setTimeIsValid(true);
          setPhoneIsExist(false);
        }
      },
      errorHandler,
    );
    //  인증번호 전송 요청
  };

  const resetIsResend = () => {
    setIsReSended(false);
  };

  const submitAuthNumber = () => {
    setTimeout(() => {
      phoneCheckNumber(
        { number: authNumber, smsId: SMSid },
        (response: AxiosResponse) => {
          const { code } = response.data;
          console.log(response);
          if (code === 200) {
            if (isSocial === 'A') {
              navigation(SIGN_UP_PATH.SOCIAL.NICKNAME, {
                state: { phone: phoneNumber, isSocial, email: '' },
              });
            } else {
              navigation(SIGN_UP_PATH.USER_INFO, { state: { phone: phoneNumber } });
            }
          } else {
            setFeedback({ phone: '', auth: '인증번호를 확인해주세요' });
            setAuthFailed(true);
            authRef.current.focus();
          }
        },
        errorHandler,
      );
    }, 200);
  };

  const buttonContext = !isSended ? (
    <button
      type="button"
      className={classNames('login-button', { active: isValid })}
      onClick={buttonClickHandler}
    >
      인증번호 발송
    </button>
  ) : (
    <button
      type="button"
      disabled={!authIsValid}
      className={classNames('login-button', { active: authIsValid })}
      onClick={submitAuthNumber}
    >
      다음
    </button>
  );

  return (
    <div className="relative flex h-screen flex-col items-center">
      <div
        aria-hidden="true"
        className="absolute left-[21px] top-[5px] flex h-[25px] w-[25px] items-center justify-center rounded-[100%]"
        onClick={() =>
          setTimeout(() => {
            navigation(-1);
          }, 200)
        }
      >
        <img src={Arrow} alt="arrow" className="h-[20px] w-[22px]" />
      </div>
      <header className="mt-2 font-[#3f3f3f] text-lg font-medium">휴대폰 인증</header>
      <span className="mb-[55px] mt-[14px] whitespace-pre-line text-center text-sm font-normal leading-[150%] text-[#8a8a8a;]">
        원활한 서비스 제공을 위해 휴대폰 번호를 입력해주세요
      </span>
      <div className="relative">
        <input
          value={phoneNumber}
          onChange={inputChangeHandler}
          className={`${
            feedback.phone.length && `border-[2px] border-[#aa93ec]`
          } m-0 h-[50px] w-[87vw] rounded-[7px] bg-[#f2f2f2] indent-[22px] text-[18px] font-medium tracking-[0.5px] placeholder:text-[16px] placeholder:text-base placeholder:font-light placeholder:text-[#8a8a8a] focus:border-[2px] focus:border-[#c4c4c4]`}
          placeholder="휴대폰 번호"
          autoComplete="off"
          ref={phoneRef}
        />
        <p className="absolute bottom-[-30px] left-4 m-0 text-[14px] font-medium leading-[150%] text-[#aa93ec]">
          {feedback.phone}
        </p>

        <span
          aria-hidden="true"
          className={`${isSended && `bg-[#aa93ec]`} ${
            !isEntered && `animate-buttonUnMount`
          } ${
            isEntered && `animate-buttonMount`
          } absolute right-[20px] top-[calc(50%)] flex h-[24px] w-[24px] -translate-y-[50%] items-center justify-center rounded-[100px] bg-[#3f3f3f] text-center`}
          onClick={clearButtonHandler}
        >
          {isSended ? (
            <img src={Check} alt="check" />
          ) : (
            <img src={Exit} alt="exit" className="h-[10px] w-[10px]" />
          )}
        </span>
      </div>
      {isSended && (
        <div className="relative">
          <input
            value={authNumber}
            onChange={authChangeHandler}
            className={`${
              feedback.auth.length && `border-[2px] border-[#aa93ec]`
            } mt-[20px] h-[50px] w-[87vw] rounded-[7px] bg-[#f2f2f2] indent-[22px] text-[18px] font-bold tracking-[0.5px] placeholder:text-[16px] placeholder:text-base placeholder:font-light placeholder:text-[#8a8a8a] focus:border-[2px] focus:border-[#c4c4c4]`}
            placeholder="인증번호 4자리"
            autoComplete="off"
            type="number"
            ref={authRef}
          />
          <span className="absolute right-5 top-[50%] font-medium text-[#aa93ec]">
            <Timer
              isResend={isReSended}
              resendfunc={resetIsResend}
              setInValid={() => setTimeIsValid(false)}
            />
          </span>
          <p
            aria-hidden="true"
            className="absolute -bottom-[34px] right-0 m-0 rounded-[10%] p-[5px] text-[14px] font-normal text-[#8a8a8a] transition-[0.3s] active:-bottom-[36px] active:bg-[#d9d6d2]"
            onClick={authNumberResend}
          >
            인증번호 재전송
          </p>
          <p className="absolute -bottom-[30px] left-[16px] m-0 text-[14px] font-medium leading-[150%] text-[#aa93ec]">
            {feedback.auth}
          </p>
        </div>
      )}
      {buttonContext}
      {buttonIsClicked && <ToastMessage message="인증번호가 전송 되었습니다" />}
      {}
    </div>
  );
}
export default VerifyPhone;
