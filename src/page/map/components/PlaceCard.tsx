import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { analytics } from '../../../index';
import { mapAction } from '../../../redux/slice/mapSlice';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import EtcSmall from '../../../common/icons/etc-small.svg';
import { CategoryCode } from '../index.types';

interface Props {
  id: number;
  detailUrl: string;
  img: string;
  title: string;
  address: string;
  categoryCode: CategoryCode;
  map: kakao.maps.Map | undefined;
}
export const icons = {
  CA0001: WalkSmall,
  CA0002: CafeSmall,
  CA0003: EatSmall,
  CA0004: BathSmall,
  CA0005: BeautySmall,
  CA0006: HospitalSmall,
  CA0007: KinderSmall,
  CA9999: EtcSmall,
};

function PlaceCard({ id, detailUrl, img, title, address, categoryCode, map }: Props) {
  const navigate = useNavigate();
  const linkClickEvent = useAnalyticsCustomLogEvent(analytics, 'card_click');
  const dispatch = useDispatch();

  const cardClickHandler = () => {
    linkClickEvent.mutate();
    const center = map!.getCenter();
    const level = map!.getLevel();
    dispatch(
      mapAction.setCurrentPosition({
        lat: center.getLat(),
        lng: center.getLng(),
        zoom: level,
      }),
    );
    dispatch(mapAction.setDetailUrl(detailUrl));
    navigate(`detail/${id}`);
  };

  console.log(icons[categoryCode], 1);
  return (
    <div
      className="absolute bottom-[30px] left-[50%] z-[100] flex h-[90px] w-[90%]
      translate-x-[-50%] items-center rounded-[6px] border border-transparent bg-white bg-clip-content 
      bg-origin-border shadow-1"
      aria-hidden="true"
      onClick={cardClickHandler}
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
        </div>
        <div className="mr-[20px] max-h-[30%] overflow-hidden text-[12px] text-[#8a8a8a]">
          {address}
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;
