import React, { useRef } from "react";
import { useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import { analytics } from "../index";
import Logo from "../common/icons/regist.svg";
import "./Regist.scss";

const text = `델고의 추천플레이스들, 어땠나요?\n의견을 들려주세요`;

function Feedback(props: { close: () => void }) {
  const { close } = props;
  const emailRef = useRef<HTMLInputElement>(null);
  const feedbackEvent = useAnalyticsCustomLogEvent(analytics, "feedback_enter");
  const submitHandler = () => {
    close();
    feedbackEvent.mutate();
    window.open('https://naver.me/GLAI3XNe', '_blank');
  };
  return (
    <div className="regist">
      <img src={Logo} alt="logo" />
      {/* <h2>Delgo의 추천플레이스를 둘러보셨군요!</h2> */}
      <h2>
        {text}
      </h2>
      <h3>
        추첨을 통해 스타벅스 쿠폰을 드려요
      </h3>
      <div className="regist-buttons">
        <button type="button" className="regist-buttons-1" onClick={close}>
          취소
        </button>
        <button type="button" className="regist-buttons-2" onClick={submitHandler}>
          델고에게 한 마디
        </button>
      </div>
    </div>
  );
}

export default Feedback;
