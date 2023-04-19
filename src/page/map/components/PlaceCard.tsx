import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import "./PlaceCard.scss";
// import BathSmall from "../common/icons/bath-map-small.svg";
import CafeSmall from "../../../common/icons/cafe-map-small.svg";
import { analytics } from "../../../index";
import { mapAction } from "../../../redux/slice/mapSlice";
import { searchAction } from "../../../redux/slice/searchSlice";

// import BeautySmall from "../common/icons/beauty-map-small.svg";
// import WalkSmall from "../common/icons/walk-map-small.svg";
// import HospitalSmall from "../common/icons/hospital-map-small.svg";
// import EatSmall from "../common/icons/eat-map-small.svg";

function PlaceCard(props: {
  id: number;
  instaUrl: string;
  detailUrl: string;
  img: string;
  title: string;
  address: string;
  categoryCode: string;
}) {
  const navigate = useNavigate();
  const linkClickEvent = useAnalyticsCustomLogEvent(analytics, "card_click");
  const dispatch = useDispatch();
  const { id, img, title, address, categoryCode, detailUrl, instaUrl } = props;
  const icon = useMemo(() => <img src={CafeSmall} alt="" />, []);
  useEffect(() => {
    return () => {
      dispatch(mapAction.clearLink());
    };
  }, []);
  useEffect(() => {
    dispatch(mapAction.setLink(`https://reward.delgo.pet/${id}`));
  }, [id]);
  // if (categoryCode === "CA0001") {
  // icon = <img src={WalkSmall} alt="" />
  // } else if (categoryCode === "CA0002") {
  // icon = <img src={CafeSmall} alt="" />
  // } else if (categoryCode === "CA0003") {
  //   icon = <img src={EatSmall} alt="" />
  // } else if (categoryCode === "CA0004") {
  //   icon = <img src={BathSmall} alt="" />
  // } else if (categoryCode === "CA0005") {
  //   icon = <img src={BeautySmall} alt="" />
  // } else {
  //   icon = <img src={HospitalSmall} alt="" />
  // }
  const cardClickHandler = useCallback(() => {
    linkClickEvent.mutate();
    dispatch(searchAction.addViewCount());
    dispatch(mapAction.setDetailUrl(detailUrl));
    navigate(`detail`);
  }, [instaUrl]);

  return (
    <div className="placecard" aria-hidden="true" onClick={cardClickHandler}>
      <img src={img} alt="cardimg" />
      <div className="placecard-box">
        <div className="placecard-box-title">
          {title}
          {icon}
        </div>
        <div className="placecard-box-address">{address}</div>
      </div>
    </div>
  );
}

export default PlaceCard;
