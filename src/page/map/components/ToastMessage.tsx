import React from "react";
import "./ToastMessage.scss";

function ToastMessage(props: { message: string }) {
  const { message } = props;
  return <div className="toast">
    {message}
  </div>
};
export default ToastMessage;