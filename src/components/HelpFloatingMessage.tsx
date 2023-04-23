import React from 'react';
import './HelpFloatingMessage.scss';

function HelpFloatingMessage(props: { text: string; direction: string }) {
  const { text, direction } = props;
  return <div className="help-floating">추억을 기록해보세요</div>;
}

export default HelpFloatingMessage;
