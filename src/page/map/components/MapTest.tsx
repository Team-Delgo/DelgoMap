import React, { useRef, useEffect, useState } from 'react';
import './Map.scss';
import CafeBig from '../../../common/icons/cafe-map.svg';

function MapTest() {
  const mapElement = useRef(null);
  const [globarMap, setGlobarMap] = useState<kakao.maps.Map>();

  useEffect(() => {
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    if (!mapElement.current) return;
    const map = new kakao.maps.Map(mapElement.current, options);
    const position = new kakao.maps.LatLng(33.450701, 126.570667);
    const imageSize = new kakao.maps.Size(40, 40);
    const imageOptions = {
      offset: new kakao.maps.Point(27, 69)
    };
    const image = new kakao.maps.MarkerImage(CafeBig, imageSize, imageOptions);
    const marker = new kakao.maps.Marker({
      position,
      image,
    });
    console.log(marker);
    marker.setMap(map);
  }, []);

  return <div className="map" ref={mapElement} />;
}

export default MapTest;
