import React from 'react';
import BackArrowImg from '../common/icons/back-arrow.svg';
import "./BackArrow.scss";

function BackArrow(props: { onClickHandler: () => void }) {
  const { onClickHandler } = props;
  return (
    <div aria-hidden className="BackArrow" onClick={onClickHandler}>
      <img src={BackArrowImg} alt="back" />
    </div>
  );
}
export default BackArrow;
