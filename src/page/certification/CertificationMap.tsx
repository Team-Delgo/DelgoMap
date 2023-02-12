import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Back from '../../common/icons/back-arrow.svg';
import Exit from '../../common/icons/exit.svg';
import Marker from '../../common/icons/cert-map-marker.svg';
import RightArrow from "../../common/icons/right-arrow-gray.svg";
import './CertificationMap.scss';
import { RootState } from '../../redux/store';
import { CAMERA_PATH } from '../../common/constants/path.const';
import { uploadAction } from '../../redux/slice/uploadSlice';

function CertificationMap() {
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const currentPlaceName = useSelector((state:RootState) => state.map.currentPlaceName);
  const initMapCenter = useSelector((state: any) => state.map);
  const [address, setAddress] = useState('');
  const [currentMarker, setCurrentMarker] = useState<naver.maps.Marker>();
  const [pointerLocation, setPointerLocation] = useState({ lat: 0, lng: 0 });
  const [globarMap, setGlobarMap] = useState<naver.maps.Map>();
  const [currentLocation, setCurrentLocation] = useState({
    lat: !initMapCenter.y ? 37.5057018 : initMapCenter.y,
    lng: !initMapCenter.x ? 127.1141119 : initMapCenter.x,
    zoom: !initMapCenter.zoom ? 14 : initMapCenter.zoom,
    option: { zoom: 2, size: 70 },
  });
  let map: naver.maps.Map;
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (!mapElement.current || !naver) return;
    const location = new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng);
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: currentLocation.zoom,
      zoomControl: false,
    };

    map = new naver.maps.Map(mapElement.current, mapOptions);

    setGlobarMap(map);
    naver.maps.Event.addListener(map, 'click', (e: naver.maps.PointerEvent) => {
      setPointerLocation(() => {
        return { lat: e.coord.y, lng: e.coord.x };
      });
    });
    return () => {
      document.body.style.overflow = 'scroll';
    };
  }, []);

  const selectManualPlace = () => {
    dispatch(
      uploadAction.setManualPlace({
        placeName: currentPlaceName,
        address,
        latitude: String(pointerLocation.lat),
        longitude: String(pointerLocation.lng),
      }),
    );
    navigate(CAMERA_PATH.CERTIFICATION);
  };

  const locationCard = <div className='location-card'>
    <div className='location-card-left'>
      <h4>{currentPlaceName}</h4>
      <p>{address}</p>
    </div>
    <div className='location-card-right' aria-hidden="true" onClick={selectManualPlace}>여기로 기록<img src={RightArrow} alt="next"/></div>
  </div>


  useEffect(() => {
    console.log(pointerLocation, currentPlaceName);
    if (currentMarker) {
      currentMarker.setMap(null);
    }
    const markerOption = {
      position: new window.naver.maps.LatLng(pointerLocation),
      map: globarMap,
      icon: {
        content: [`<div class="cert-map-marker" >`, `<img src=${Marker}  style="" alt="pin"/>`, `</div>`].join(''),
        size: new naver.maps.Size(20, 20),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(17, 48),
      },
    };
    const marker = new naver.maps.Marker(markerOption);
    setCurrentMarker(marker);
    if (pointerLocation.lat !== 0) {
      naver.maps.Service.reverseGeocode(
        {
          coords: new naver.maps.LatLng(pointerLocation.lat, pointerLocation.lng),
        },
        function (status, response) {
          if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
          }

          const result = response.v2;
          setAddress(result.address.jibunAddress);
        },
      );
    }
  }, [pointerLocation]);

  const navigateBack = useCallback(() => navigate(-1), []);

  return (
    <div className="map-wrapper">
      {pointerLocation.lat > 0 && locationCard}
      <div className="whiteBox" />
      <div className="cert-map-header">
        <img className="cert-map-header-back" src={Back} alt="back" onClick={navigateBack} aria-hidden />
        <h4 className="cert-map-header-name">지도에 직접추가</h4>
        <img className="cert-map-header-exit" src={Exit} alt="close" onClick={navigateBack} aria-hidden />
      </div>
      <div className="map" ref={mapElement} style={{ position: 'absolute' }} />
    </div>
  );
}

export default CertificationMap;
