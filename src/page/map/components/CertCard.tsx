import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import EtcSmall from '../../../common/icons/etc-small.svg';
import { Cert } from '../index.types';
import { RECORD_PATH, ROOT_PATH } from '../../../common/constants/path.const';
import { RootState } from '../../../redux/store';

interface Props {
  img: string;
  title: string;
  description: string;
  categoryCode:
    | 'CA0001'
    | 'CA0002'
    | 'CA0003'
    | 'CA0004'
    | 'CA0005'
    | 'CA0006'
    | 'CA0007'
    | 'CA9999';
  registDt: string;
  cert: Cert;
  setCenter: () => void;
}
const icons = {
  CA0001: WalkSmall,
  CA0002: CafeSmall,
  CA0003: EatSmall,
  CA0004: BathSmall,
  CA0005: BeautySmall,
  CA0006: HospitalSmall,
  CA0007: KinderSmall,
  CA9999: EtcSmall,
};

function CertCard({
  img,
  title,
  description,
  categoryCode,
  registDt,
  cert,
  setCenter,
}: Props) {
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const navigate = useNavigate();
  const descriptionText =
    description.length > 50 ? `${description.substring(0, 50)}...` : description;
  return (
    <div
      className="absolute bottom-[30px] left-[50%] z-[100] flex h-[90px] w-[90%]
      translate-x-[-50%] items-center rounded-[6px] border border-transparent bg-white bg-clip-content 
      bg-origin-border shadow-1"
      aria-hidden="true"
      onClick={() => {
        setCenter();
        navigate(RECORD_PATH.CERT, {
          state: {
            info: {
              certId: cert.certificationId,
              userId,
              date: cert.registDt,
            },
            from: ROOT_PATH,
          },
        });
      }}
    >
      <img src={img} alt="cardimg" className="ml-[6px] h-[78px] w-[78px] rounded-[6px]" />
      <div className="ml-[13px] max-h-[100%]">
        <div className="flex items-center text-[16px] font-semibold">
          {title}
          <img
            src={icons[categoryCode]}
            alt="icon"
            className="ml-[4px] h-[19px] w-[19px]"
          />
          <div className="absoulte right-[16px] text-[10px] text-[#8a8a8a]">
            {registDt.slice(0, 10)}
          </div>
        </div>
        <div className="mr-[20px] max-h-[30%] overflow-hidden text-[12px] text-[#8a8a8a]">
          {descriptionText}
        </div>
      </div>
    </div>
  );
}

export default CertCard;
