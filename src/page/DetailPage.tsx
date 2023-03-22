import React, { PropsWithChildren, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import BackArrow from '../common/icons/back-arrow.svg';
import './DetailPage.scss';
import BallLoading from '../common/utils/BallLoading';

function ImageBox({children} : PropsWithChildren<unknown>){
  return <div style={{
    display: 'block',
    width: '90%',
    height: '100%',
  }}>
    {children}
  </div>
}

function DetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [imgLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();
  const url = useSelector((state: any) => state.map.detailImgUrl);
  
  useEffect(()=>{
    setTimeout(()=>{
      setIsLoading(false);
    },1000)
  },[])
  
  return (
    <div className="detail">
      {(isLoading || imgLoading) && <BallLoading/>}
      <img
        src={BackArrow}
        alt="back"
        className="detail-back"
        aria-hidden="true"
        onClick={() => {
          navigate(-1);
        }}
      />
      <img className="detail-img" src={url} alt="url" onLoad={()=>setImageLoading(false)}/>
    </div>
  );
}

export default DetailPage;
