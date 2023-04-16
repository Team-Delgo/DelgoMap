import React, {useState} from "react";
import classNames from "classnames";
import DogFoot from "../../../common/icons/dogfoot.svg";
import "./CertToggle.scss";

function CertToggle(props:{onClick:()=>void, state:boolean}){
  const {onClick, state} = props;
  const [isDisabled, setIsDisabled] = useState(false);
  const onClickHandler = () => {
    if(!isDisabled){
      onClick();
      setIsDisabled(true);
      setTimeout(()=>setIsDisabled(false),100);
    }
  };
  return <div className={classNames("certtoggle",{off:!state})} aria-hidden="true" onClick={onClickHandler}>
    <img src={DogFoot} alt="toggle"/>
  </div>
};

export default CertToggle;