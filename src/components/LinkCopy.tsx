import React, { useCallback } from "react";
import { useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import { useDispatch, useSelector } from "react-redux";
import Link from "../common/icons/link.svg";
import { analytics } from "../index";
import { mapAction } from "../redux/mapSlice";
import "./LinkCopy.scss";

function LinkCopy() {
  const linkCopyEvent = useAnalyticsCustomLogEvent(analytics, "link_copy");
  const dispatch = useDispatch();
  const url = useSelector((state: any) => state.map.link);

  const buttonClickHandler = useCallback(() => {
    navigator.clipboard.writeText(url);
    navigator.share({
      title:'delgo 공유',
      text:'delgo 공유',
      url:url,
    })
    linkCopyEvent.mutate();
    dispatch(mapAction.setIsCopy());
    setTimeout(() => {
      dispatch(mapAction.setIsCopyFalse());
    }, 2000);
  }, [url]);

  return (
    <div className="link" aria-hidden="true" onClick={buttonClickHandler}>
      <img src={Link} alt="link" />
    </div>
  );
}

export default LinkCopy;
