import React from 'react';
import './ToastMessage.scss';

function ToastMessage(props: { message: string }) {
  const { message } = props;

  return (
    <div className="toastmessage">
      <p className="toastmessage-text">{message}</p>
    </div>
  );
}
export default ToastMessage;
