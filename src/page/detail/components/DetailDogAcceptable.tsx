import React from "react";
import Circle from "../../../common/icons/circle.svg";
import Triangle from "../../../common/icons/trianlge.svg";
import X from "../../../common/icons/small-x.svg";

interface Props{
  type: string;
  allow: string;
}

function DetailDogAcceptable({type, allow}:Props) {
  let className;
  let icon;
  if(allow === "ALLOW") {
    className="detail-info-doglist-dog allow";
    icon = Circle;
  }else if(allow === "OUTDOOR"){
    className="detail-info-doglist-dog outdoor";
    icon = Triangle;
  }else{
    className="detail-info-doglist-dog deny";
    icon = X;
  }
  return <div className={className}>
    <img src={icon} alt="icon" />
    {type}
  </div>
};

export default DetailDogAcceptable;