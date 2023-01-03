import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAnalyticsLogEvent, useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import './Map.scss';
import { getMapData } from '../common/api/record';
import { Mungple, Cert, certDefault, idDefault, WardOffice } from './maptype';
import Cafe from '../common/icons/cafe-map.svg';
import CafeSmall from "../common/icons/cafe-map-small.svg";
import PlaceCard from './PlaceCard';
import { analytics } from '../index';
import { setMarkerOptionBig, setMarkerOptionSmall, setMarkerOptionPrev, setCertOption } from './MapComponent';

interface MakerItem {
  id: number;
  marker: naver.maps.Marker;
}

function Map() {
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mungple, setMungple] = useState('ON');
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [globarMap, setGlobarMap] = useState<naver.maps.Map>();
  const [selectedId, setSelectedId] = useState(idDefault);
  const [mungpleList, setMungpleList] = useState<Mungple[]>([]);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
  const initMapCenter = useSelector((state: any) => state);
  const [currentLocation, setCurrentLocation] = useState({
    lat: !initMapCenter.y ? 37.5626571 : initMapCenter.y,
    lng: !initMapCenter.x ? 127.00086 : initMapCenter.x,
    zoom: !initMapCenter.zoom ? 17 : initMapCenter.zoom,
    option: { zoom: 2, size: 70 },
  });
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const mungpleClickEvent = useAnalyticsCustomLogEvent(analytics, 'map_mungple');
  let map: naver.maps.Map;

  const clearSelectedId = () => {
    setSelectedId((prev: any) => {
      return {
        img: '',
        title: '',
        address: '',
        id: 0,
        prevId: prev.id,
        lat: 0,
        lng: 0,
        categoryCode: '0',
        prevLat: prev.lat,
        prevLng: prev.lng,
        prevCategoryCode: prev.categoryCode,
      };
    });
  };

  const getMapPageData = () => {
    getMapData(
      (response: AxiosResponse) => {
        const { data } = response.data;
        setMungpleList(data);
      },
      dispatch,
    );
  };

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'Map',
        firebase_screen_class: 'MapPage',
      },
    });
    getMapPageData();
    console.log(initMapCenter);
    if (initMapCenter.x === 0 && initMapCenter.y === 0) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          zoom: 17,
          option: { zoom: 2, size: 70 },
        });
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    } else {
      // setCurrentLocation({
      //   lat: initMapCenter.x,
      //   lng: initMapCenter.y,
      //   zoom: 17,
      //   option: {zoom:2, size:70},
      // })
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

  }, []);

  useEffect(() => {
    if (!mapElement.current || !naver) return;
    console.log(currentLocation);
    const location = new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng);
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: currentLocation.zoom,
      zoomControl: false,
    };

    map = new naver.maps.Map(mapElement.current, mapOptions);

    setGlobarMap(map);
    naver.maps.Event.addListener(map, 'tap', (e) => {
      e.preventDefault();
      clearSelectedId();
    });

    return () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      // dispatch(scrollActions.setMapCenter({ x: center?.x, y: center?.y, zoom }));
    };
  }, []);

  useEffect(() => {
    deleteMungpleList();
    const tempList = mungpleList.map((data) => {
      let markerOptions: naver.maps.MarkerOptions;
      markerOptions = setMarkerOptionSmall(CafeSmall, data, globarMap);
      const marker = new naver.maps.Marker(markerOptions);
      marker.addListener('click', () => {
        mungpleClickEvent.mutate();
        setSelectedId((prev: any) => {
          return {
            img: data.photoUrl,
            title: data.placeName,
            address: data.jibunAddress,
            id: data.mungpleId,
            prevId: prev.id,
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            categoryCode: data.categoryCode,
            prevLat: prev.lat,
            prevLng: prev.lng,
            prevCategoryCode: prev.categoryCode,
          };
        });
        markerOptions = setMarkerOptionBig(Cafe, data, globarMap, selectedId.prevCategoryCode);
        marker.setOptions(markerOptions);
      });
      return { marker, id: data.mungpleId };
    });
    setMarkerList(tempList);

  }, [mungpleList]);

  useEffect(() => {
    if (selectedId.prevId === selectedId.id) return;
    if (selectedId.prevId > 0) {
      const index = markerList.findIndex((e) => {
        return e.id === selectedId.prevId;
      });
      let markerOptions: naver.maps.MarkerOptions;
      markerOptions = setMarkerOptionPrev(CafeSmall, selectedId, globarMap);
      markerList[index].marker.setOptions(markerOptions);
    }
  }, [selectedId]);

  const deleteMungpleList = () => {
    markerList.forEach((marker) => {
      marker.marker.setMap(null);
    });
  };

  return (
    <div>
      <div className="map" ref={mapElement} style={{ position: 'absolute' }}>
      </div>
      {selectedId.title.length > 0 && (
        <PlaceCard img={selectedId.img} title={selectedId.title} address={selectedId.address} categoryCode={selectedId.categoryCode} />
      )}
    </div>
  );
}

export default Map;