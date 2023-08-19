import React,{useState} from 'react';
import BallLoadingGif from '../icons/loading.gif';
import "./BallLoading.scss";

function BallLoading() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="ball-loading-container">
      <div className="ball-loading-wrapper">
        <img className="ball-loading-img" src={BallLoadingGif} alt="ball-loading" onLoad={()=>setIsLoaded(true)}/>
      </div>
      {/* 이미지가 로드되면 백그라운드 랜더링 */}
      {isLoaded && <div className="ball-loading-background" />}
    </div>
  );
}

export default BallLoading;
