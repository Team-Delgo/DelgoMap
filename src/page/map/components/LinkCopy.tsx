import React, { useCallback } from "react";
import { useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import { useDispatch, useSelector } from "react-redux";
import Link from "../../../common/icons/link.svg";
import { analytics } from "../../../index";
import "./LinkCopy.scss";

function LinkCopy() {
  const linkCopyEvent = useAnalyticsCustomLogEvent(analytics, "link_copy");
  const url = useSelector((state: any) => state.map.link);
  
  const sendScrap = () => {
    console.log(url);
    window.Kakao.Share.sendScrap({
      requestUrl: url,
    });
  }

  const buttonClickHandler = useCallback(() => {
    sendScrap();
    linkCopyEvent.mutate();
  }, [url]);

  return (
    <div className="link" aria-hidden="true" onClick={buttonClickHandler}>
      <img src={Link} alt="link" />
      친구에게 공유하기
    </div>
  );
}

export default LinkCopy;
