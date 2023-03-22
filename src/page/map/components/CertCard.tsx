import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceCard.scss';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import EtcSmall from '../../../common/icons/etc-small.svg';
import { Cert } from '../../../common/types/map';
import { RECORD_PATH, ROOT_PATH } from '../../../common/constants/path.const';

function CertCard(props: {
  img: string;
  title: string;
  description: string;
  categoryCode: string;
  registDt: string;
  cert: Cert;
  setCenter: ()=>void;
}) {
  const { img, title, description, registDt, categoryCode,cert, setCenter } = props;
  console.log(cert);
  const navigate = useNavigate();
  const descriptionText = description.length > 50 ? `${description.substring(0, 50)}...` : description;
  let icon;
  if (categoryCode === 'CA0001') {
    icon = <img src={WalkSmall} alt="walk" />;
  } else if (categoryCode === 'CA0002') {
    icon = <img src={CafeSmall} alt="cafe" />;
  } else if (categoryCode === 'CA0003') {
    icon = <img src={EatSmall} alt="eat" />;
  } else if (categoryCode === 'CA0004') {
    icon = <img src={BathSmall} alt="bath" />;
  } else if (categoryCode === 'CA0005') {
    icon = <img src={BeautySmall} alt="beauty" />;
  } else if (categoryCode === 'CA0006'){
    icon = <img src={HospitalSmall} alt="hospital" />;
  } else {
    icon = <img src={EtcSmall} alt="etc" />;
  }
  return (
    <div
      className="placecard"
      aria-hidden="true"
      onClick={() => {
        setCenter();
        navigate(RECORD_PATH.CERT, { state: {certifications:[cert], pageFrom:ROOT_PATH} });
      }}
    >
      <img src={img} alt="cardimg" />
      <div className="placecard-box">
        <div className="placecard-box-title">
          {title}
          {icon}
          <div className="placecard-registDt">{registDt.slice(0, 10)}</div>
        </div>
        <div className="placecard-box-address">{descriptionText}</div>
      </div>
    </div>
  );
}

export default CertCard;
