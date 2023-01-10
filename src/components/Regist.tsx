import { AxiosResponse } from "axios";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { sendEmail } from "../common/api/record";
import Logo from "../common/icons/regist.svg";
import "./Regist.scss";

function Regist(props: { close: () => void }) {
  const dispatch = useDispatch();
  const { close } = props;
  const emailRef = useRef<HTMLInputElement>(null);
  const submitHandler = () => {
    sendEmail(emailRef.current!.value, (data: AxiosResponse) => {
      console.log(data);
    }, dispatch);
    close();
  };
  return <div className="regist">
    <img src={Logo} alt="logo" />
    <h3>사전예약을 받고 있어요 메일을 입력하시면 델고를 가장 먼저 사용해 보실 수 있어요</h3>
    <input ref={emailRef} placeholder="이메일" />
    <div className="regist-buttons">
      <button type="button" className="regist-buttons-1" onClick={close}>취소</button>
      <button type="button" className="regist-buttons-2" onClick={submitHandler}>확인</button>
    </div>
  </div>
};

export default Regist;