import { useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import React from "react";
import { useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { analytics } from "..";
import { UPLOAD_PATH } from "../common/constants/path.const";
import Plus from "../common/icons/plus.svg";
import { uploadAction } from "../redux/slice/uploadSlice";
import "./CertFloatingButton.scss";

function CertFloatingButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clickEvent = useAnalyticsCustomLogEvent(analytics, "cert-floating-click");


  const certButtonHandler = () => {
    clickEvent.mutate();
    dispatch(uploadAction.initAchievements());
    navigate(UPLOAD_PATH.CERTIFICATION)
  };

  return (
    <div className="cert-floating-button" aria-hidden onClick={certButtonHandler}>
      <img src={Plus} alt="floating-button" />
    </div>
  );
}

export default CertFloatingButton;
