import React from "react";
import { useNavigate } from "react-router-dom";
import { RECORD_PATH } from "../common/constants/path.const";
import DogFoot from "../common/icons/dogfoot.svg";
import Plus from "../common/icons/plus.svg";
import "./FooterNavigation.scss";

function FooterNavigation(){
  const navigate = useNavigate();
  return <div className="navigation">
    <div className="navigation-button" onClick={()=>{console.log(1)}}>
      <img src={DogFoot} alt="foot"/>
      동네강아지
    </div>
    <div className="navigation-plus" onClick={()=>{console.log(2)}}>
      <img src={Plus} alt="plus" />
    </div>
    <div className="navigation-button" onClick={()=>{navigate(RECORD_PATH.CALENDAR)}}>
      <img src={DogFoot} alt="foot"/>
      내 기록
    </div>
  </div>
};

export default FooterNavigation;