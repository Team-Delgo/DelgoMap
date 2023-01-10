import React from "react";
import "./PlaceCard.scss";
import { useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
// import BathSmall from "../common/icons/bath-map-small.svg";
import CafeSmall from "../common/icons/cafe-map-small.svg";
import { analytics } from "..";
// import BeautySmall from "../common/icons/beauty-map-small.svg";
// import WalkSmall from "../common/icons/walk-map-small.svg";
// import HospitalSmall from "../common/icons/hospital-map-small.svg";
// import EatSmall from "../common/icons/eat-map-small.svg";

function PlaceCard(props: { instaUrl: string, detailUrl: string, img: string, title: string, address: string, categoryCode: string }) {
  const linkClickEvent = useAnalyticsCustomLogEvent(analytics, 'card_click');
  const { img, title, address, categoryCode, detailUrl, instaUrl } = props;
  let icon;
  // if (categoryCode === "CA0001") {
  // icon = <img src={WalkSmall} alt="" />
  // } else if (categoryCode === "CA0002") {
  icon = <img src={CafeSmall} alt="" />
  // } else if (categoryCode === "CA0003") {
  //   icon = <img src={EatSmall} alt="" />
  // } else if (categoryCode === "CA0004") {
  //   icon = <img src={BathSmall} alt="" />
  // } else if (categoryCode === "CA0005") {
  //   icon = <img src={BeautySmall} alt="" />
  // } else {
  //   icon = <img src={HospitalSmall} alt="" />
  // }
  const cardClickHandler = () => {
    linkClickEvent.mutate();
    window.open(instaUrl, '_blank');
  };

  return <div className="placecard" aria-hidden="true" onClick={cardClickHandler}>
    <img src={img} alt="cardimg" />
    <div className="placecard-box">
      <div className="placecard-box-title">{title}{icon}</div>
      <div className="placecard-box-address">{address}</div>
    </div>
  </div>
}

export default PlaceCard;