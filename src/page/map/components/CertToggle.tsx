import React from "react";
import classNames from "classnames";
import DogFoot from "../../../common/icons/dogfoot.svg";
import "./CertToggle.scss";

function CertToggle(props:{onClick:()=>void, state:boolean}){
  const {onClick, state} = props;
  return <div className={classNames("certtoggle",{off:!state})} aria-hidden="true" onClick={onClick}>
    <img src={DogFoot} alt="toggle"/>
  </div>
};

export default CertToggle;