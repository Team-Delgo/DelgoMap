import React from 'react';
import BallLoadingGif from '../icons/loading.gif';
import "./BallLoading.scss";

function BallLoading() {
  return (
    <div className="ball-loading-container">
      <div className="ball-loading-wrapper">
        <img className="ball-loading-img" src={BallLoadingGif} alt="ball-loading" />
      </div>
      <div className="ball-loading-background" />
    </div>
  );
}

export default BallLoading;
