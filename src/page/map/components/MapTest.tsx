import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import './Map.scss';
import CafeBig from '../../../common/icons/cafe-map.svg';
import { getMapData } from '../../../common/api/record';
import { RootState } from '../../../redux/store';
import { Cert, certDefault, idDefault, Mungple } from './maptype';
import FooterNavigation from '../../../components/FooterNavigation';
import { mapAction } from '../../../redux/slice/mapSlice';
import Logo from '../../../common/icons/logo.svg';

function MapTest() {
  const mapElement = useRef(null);
  const initMapCenter = useSelector((state: RootState) => state.map);
  const [globarMap, setGlobarMap] = useState<kakao.maps.Map>();
  const [mungpleList, setMungpleList] = useState<Mungple[]>([]);

  const [selectedId, setSelectedId] = useState(idDefault);
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);

  const [mungpleCertList, setMunpleCertList] = useState<Cert[]>([]);
  const [normalCertList, setNormalCertList] = useState<Cert[]>([]);
  const [otherMungpleCertList, setOtherMungpleCertList] = useState<Cert[]>([]);
  const [otherNormalCertList, setOtherNormalCertList] = useState<Cert[]>([]);
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.persist.user.user.id);

  const getMapPageData = useCallback(() => {
    getMapData(
      userId,
      (response: AxiosResponse) => {
        console.log(response);
        const { data } = response.data;
        setMungpleList(data.mungpleList);
        setNormalCertList(data.normalCertList);
        setMunpleCertList(data.mungpleCertList);
        setOtherMungpleCertList(data.exposedMungpleCertList);
        setOtherNormalCertList(data.exposedNormalCertList);
      },
      dispatch,
    );
  }, []);

  useEffect(() => {
    getMapPageData();
    const options = {
      center: new kakao.maps.LatLng(initMapCenter.lat, initMapCenter.lng),
      level: 3,
    };
    if (!mapElement.current) return;
    const map = new kakao.maps.Map(mapElement.current, options);
    setGlobarMap(map);
    const position = new kakao.maps.LatLng(33.450701, 126.570667);
    const imageSize = new kakao.maps.Size(40, 40);
    const imageOptions = {
      offset: new kakao.maps.Point(27, 69),
    };
    const image = new kakao.maps.MarkerImage(CafeBig, imageSize, imageOptions);
    const marker = new kakao.maps.Marker({
      position,
      image,
    });
    console.log(marker);
    marker.setMap(map);
  }, []);

  useEffect(() => {
    mungpleList.map((m) => {
      const position = new kakao.maps.LatLng(
        parseFloat(m.latitude),
        parseFloat(m.longitude),
      );
      const imageSize = new kakao.maps.Size(30, 30);
      const imageOptions = {
        offset: new kakao.maps.Point(27, 69),
      };
      const image = new kakao.maps.MarkerImage(CafeBig, imageSize, imageOptions);
      const marker = new kakao.maps.Marker({
        position,
        image,
      });
      if (globarMap) marker.setMap(globarMap);
      return marker;
    });
  }, [mungpleList]);

  const setCurrentMapPosition = () => {
    const center = globarMap?.getCenter();
    const zoom = globarMap?.getLevel();
    dispatch(
      mapAction.setCurrentPosition({ lat: center?.getLat, lng: center?.getLng, zoom }),
    );
  };

  return (
    <div className="map-wrapper">
      <div className="whiteBox" />
      <img className="map-logo" src={Logo} alt="logo" />
      <div className="slogun">강아지 델고 동네생활</div>
      <div className="map" ref={mapElement} />
      {selectedId.title.length === 0 && selectedCert.placeName.length === 0 && (
        <FooterNavigation setCenter={setCurrentMapPosition} />
      )}
    </div>
  );
}

export default MapTest;
