import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackArrow from "../common/icons/back-arrow.svg";
import "./DetailPage.scss";

function DetailPage(){
  const navigate = useNavigate();
  const url = useSelector((state:any)=> state.map.detailImgUrl);
  return <div className="detail">
    <img src={BackArrow} alt="back" className="detail-back" aria-hidden="true" onClick={()=>{navigate(-1)}}/>
    <img className="detail-img" src={url} alt="url" />
  </div>
};

export default DetailPage;
