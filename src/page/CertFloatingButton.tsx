import React from "react";
import Plus from "../common/icons/plus.svg";
import "./CertFloatingButton.scss";

function CertFloatingButton() {
  return (
    <div className="cert-floating-button">
      <img src={Plus} alt="floating-button" />
    </div>
  );
}

export default CertFloatingButton;
