import React from "react";
import "./PlaceCard.scss";
// import BathSmall from "../common/icons/bath-map-small.svg";
import CafeSmall from "../common/icons/cafe-map-small.svg";
// import BeautySmall from "../common/icons/beauty-map-small.svg";
// import WalkSmall from "../common/icons/walk-map-small.svg";
// import HospitalSmall from "../common/icons/hospital-map-small.svg";
// import EatSmall from "../common/icons/eat-map-small.svg";

function PlaceCard(props: { img: string, title: string, address: string, categoryCode: string }) {
  const { img, title, address, categoryCode } = props;
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
  return <div className="placecard">
    <img src={img} alt="cardimg" />
    <div className="placecard-box">
      <div className="placecard-box-title">{title}{icon}</div>
      <div className="placecard-box-address">{address}</div>
    </div>
  </div>
}

export default PlaceCard;