import classNames from 'classnames';
import React from 'react';
import BackArrowImg from '../common/icons/prev-arrow-black.svg';
import './BackArrow.scss';
import BackArrowWhite from '../common/icons/prev-arrow-white.svg';

interface BackArrowProps {
  onClickHandler: () => void;
  isFixed?: boolean;
  white?: boolean;
}

function BackArrowComponent({ onClickHandler, isFixed, white }: BackArrowProps) {
  return (
    <div
      aria-hidden
      className={classNames('BackArrow', { isFixed })}
      onClick={onClickHandler}
    >
      <img src={white ? BackArrowWhite : BackArrowImg} alt="back" />
    </div>
  );
}

BackArrowComponent.defaultProps = {
  isFixed: false,
  white: false,
};

export default BackArrowComponent;
