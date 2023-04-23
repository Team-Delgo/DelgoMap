import classNames from 'classnames';
import React from 'react';
import './HelpFloatingMessage.scss';

function HelpFloatingMessage(props: { text: string; direction: string }) {
  const { text, direction } = props;
  return (
    <div className={classNames('help-floating', { right: direction === 'right' })}>
      {text}
    </div>
  );
}

export default HelpFloatingMessage;
