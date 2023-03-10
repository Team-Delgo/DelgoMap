import { AxiosResponse } from "axios";
import { useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { analytics } from "../../../index";
import { sendEmail } from "../../../common/api/record";
import "./Regist.scss";

const text = `강아지와의 동네생활을 위한 앱\n델고의 사전예약을 받고 있어요`

function Regist(props: { close: () => void, feedbackOpen: () => void }) {
  const { close, feedbackOpen } = props;
  const dispatch = useDispatch();
  const registEvent = useAnalyticsCustomLogEvent(analytics, "email_regist");
  const emailRef = useRef<HTMLInputElement>(null);
  const submitHandler = () => {
    sendEmail(
      emailRef.current!.value,
      (data: AxiosResponse) => {
        registEvent.mutate();
      },
      dispatch
    );
    close();
    feedbackOpen();
  };
  return (
    <div className="regist">
      <h2>
      {text}
      </h2>
      <h3>
      델고 소식을 가장 먼저 받아보세요
      </h3>
      <input ref={emailRef} placeholder="E-Mail" />
      <div className="regist-buttons">
        <button type="button" className="regist-buttons-1" onClick={close}>
          닫기
        </button>
        <button type="button" className="regist-buttons-2" onClick={submitHandler}>
          확인
        </button>
      </div>
    </div>
  );
}

export default Regist;
