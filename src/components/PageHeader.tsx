import classNames from 'classnames';
import React from 'react';
import BackArrowComponent from './BackArrowComponent';
import "./PageHeader.scss";

interface PageHeaderProps{
  title: string;
  navigate: () => void;
  isFixed?: boolean;
  isAbsolute?: boolean;
  short?: boolean;
}

function PageHeader({title, navigate, isFixed, isAbsolute, short }:PageHeaderProps) {
  return (
    <div className={classNames('page-header', { isFixed, isAbsolute, short })}>
      <BackArrowComponent onClickHandler={navigate} />
      <div className="page-header-text">{title}</div>
    </div>
  );
}

PageHeader.defaultProps = {
  isFixed : false,
  isAbsolute : false,
  short : false
}

export default PageHeader;
