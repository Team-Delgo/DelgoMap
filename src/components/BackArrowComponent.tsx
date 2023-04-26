import classNames from 'classnames';
import React from 'react';
import BackArrowImg from '../common/icons/prev-arrow-black.svg';
import "./BackArrow.scss";

interface BackArrowProps{
  onClickHandler: () => void;
  isFixed?:boolean;
}

function BackArrowComponent({onClickHandler, isFixed} : BackArrowProps) {
  return (
    <div aria-hidden className={classNames("BackArrow",{isFixed})} onClick={onClickHandler}>
      <img src={BackArrowImg} alt="back" />
    </div>
  );
}

BackArrowComponent.defaultProps = {
  isFixed : false
}

export default BackArrowComponent;
