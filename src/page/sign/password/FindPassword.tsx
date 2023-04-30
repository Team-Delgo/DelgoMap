import React, { ChangeEvent, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { AxiosError, AxiosResponse } from "axios";
import Arrow from '../../../common/icons/left-arrow.svg';
import "./FindPassword.scss";
import { emailAuth } from "../../../common/api/login";
import { SIGN_IN_PATH } from "../../../common/constants/path.const";
import Check from "../../../common/icons/check.svg";
import { useErrorHandlers } from "../../../common/api/useErrorHandlers";

function FindPassword() {
  const [email, setEmail] = useState('');
  const [emailIsSubmitted, setEmailIsSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFeedback('');
  };

  const emailCheck = useMutation(() => emailAuth(email), {
    onSuccess: (data) => {
      if (data.data.code === 200){
      setPhoneNumber(data.data.data);
      setEmailIsSubmitted(true);}
      else {
        setFeedback('가입되지 않은 이메일입니다.');
        inputRef.current?.focus();
      }
    },
    onError: (error: AxiosError) => {
      useErrorHandlers(dispatch, error);

    },
  });

  const submitEmail = () => {
    emailCheck.mutate();
  };

  const nextButtonHandler = () => {
    navigation(SIGN_IN_PATH.PHONEAUTH, { state: { phone: phoneNumber, email, } });
  };

  return (
    <div className="login">
      <div aria-hidden="true" className="login-back" onClick={() => navigation(-1)}>
        <img src={Arrow} alt="back-arrow" />
      </div>
      <header className="login-header">비밀번호 재설정</header>
      {!emailIsSubmitted ? <div>
        <div className="login-description longmargin">회원가입 시 등록한 이메일을 입력해 주세요</div>
        <div className="login-input-box">
          <input
            className={classNames("login-input", { invalid: feedback.length })}
            placeholder="이메일"
            autoComplete="off"
            value={email}
            ref={inputRef}
            onChange={inputChangeHandler}
          />
          <div className="login-input-feedback">{feedback}</div>
        </div>
      </div> : <div className="findpassword-selectbox">
        <div className="findpassword-selectbox-circle">
          <img src={Check} alt="check" />
        </div>
        <div className="findpassword-selectbox-wrapper">
          <div className="findpassword-selectbox-label">등록된 휴대폰번호로 인증</div>
          <div className="findpassword-selectbox-number">{`${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`}</div>
        </div>
      </div>}
      <button type="button" className="login-button active" onClick={emailIsSubmitted ? nextButtonHandler : submitEmail}>
        확인
      </button>
    </div>
  );
};

export default FindPassword;