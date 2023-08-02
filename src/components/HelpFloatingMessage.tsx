import classNames from 'classnames';
import React from 'react';
import './HelpFloatingMessage.scss';

interface Props {
  text: string;
  guide: 'startCert' | 'viewCert';
}

function HelpFloatingMessage({ text, guide }: Props) {
  return (
    <div className={classNames('help-floating', { right: guide === 'viewCert' })}>
      {text}
    </div>
  );
}

export default HelpFloatingMessage;
