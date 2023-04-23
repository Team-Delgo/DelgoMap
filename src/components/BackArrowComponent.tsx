import React from 'react';
import BackArrowImg from '../common/icons/prev-arrow-black.svg';
import "./BackArrow.scss";

function BackArrowComponent(props: { onClickHandler: () => void }) {
  const { onClickHandler } = props;
  return (
    <div aria-hidden className="BackArrow" onClick={onClickHandler}>
      <img src={BackArrowImg} alt="back" />
    </div>
  );
}
export default BackArrowComponent;
