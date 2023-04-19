import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import './PlaceCard.scss';
import { analytics } from '../../../index';
import { mapAction } from '../../../redux/slice/mapSlice';
import { searchAction } from '../../../redux/slice/searchSlice';

import BathSmall from '../../../common/icons/bath-map-small.svg';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';

function PlaceCard(props: {
  id: number;
  instaUrl: string;
  detailUrl: string;
  img: string;
  title: string;
  address: string;
  categoryCode: string;
}) {
  const navigate = useNavigate();
  const linkClickEvent = useAnalyticsCustomLogEvent(analytics, 'card_click');
  const dispatch = useDispatch();
  const { id, img, title, address, categoryCode, detailUrl, instaUrl } = props;
  const icon = useMemo(() => {
    console.log(categoryCode);
    if (categoryCode === 'CA0001') {
      return <img src={WalkSmall} alt="" />;
    }
    if (categoryCode === 'CA0002') {
      return <img src={CafeSmall} alt="" />;
    }
    if (categoryCode === 'CA0003') {
      return <img src={EatSmall} alt="" />;
    }
    if (categoryCode === 'CA0004') {
      return <img src={BathSmall} alt="" />;
    }
    if (categoryCode === 'CA0005') {
      return <img src={BeautySmall} alt="" />;
    }
    if (categoryCode === 'CA0006') {
      return <img src={HospitalSmall} alt="" />;
    }
    return <img src={KinderSmall} alt="" />;
  }, [categoryCode]);
  useEffect(() => {
    return () => {
      dispatch(mapAction.clearLink());
    };
  }, []);
  useEffect(() => {
    dispatch(mapAction.setLink(`https://reward.delgo.pet/${id}`));
  }, [id]);

  const cardClickHandler = useCallback(() => {
    linkClickEvent.mutate();
    dispatch(searchAction.addViewCount());
    dispatch(mapAction.setDetailUrl(detailUrl));
    navigate(`detail`);
  }, [instaUrl]);

  return (
    <div className="placecard" aria-hidden="true" onClick={cardClickHandler}>
      <img src={img} alt="cardimg" />
      <div className="placecard-box">
        <div className="placecard-box-title">
          {title}
          {icon}
        </div>
        <div className="placecard-box-address">{address}</div>
      </div>
    </div>
  );
}

export default PlaceCard;
