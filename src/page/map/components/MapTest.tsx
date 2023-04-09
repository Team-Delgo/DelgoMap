import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import './Map.scss';
import CafeBig from '../../../common/icons/cafe-map.svg';
import Cafe from '../../../common/icons/cafe-map-small.svg';
import { getMapData } from '../../../common/api/record';
import { RootState } from '../../../redux/store';
import { Cert, certDefault, idDefault, Mungple } from './maptype';
import FooterNavigation from '../../../components/FooterNavigation';
import { mapAction } from '../../../redux/slice/mapSlice';
import Logo from '../../../common/icons/logo.svg';
import PlaceCard from './PlaceCard';
import { MarkerImages } from './MarkerSet';

const markerImages = MarkerImages();
const { images: bigMarker, smallImages: smallMarker } = markerImages;
const [big1, big2, big3, big4, big5, big6, big7] = bigMarker;
const [small1, small2, small3, small4, small5, small6, small7] = smallMarker;
function MapTest() {
  const mapElement = useRef(null);
  const initMapCenter = useSelector((state: RootState) => state.map);
  const [globarMap, setGlobarMap] = useState<kakao.maps.Map>();
  const [mungpleList, setMungpleList] = useState<Mungple[]>([]);

  const [selectedId, setSelectedId] = useState(idDefault);
  const [selectedMarker, setSelectedMarker] = useState<kakao.maps.Marker>();
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
      const { categoryCode } = m;
      const position = new kakao.maps.LatLng(
        parseFloat(m.latitude),
        parseFloat(m.longitude),
      );
      const imageSize = new kakao.maps.Size(30, 30);
      const imageOptions = {
        offset: new kakao.maps.Point(27, 69),
      };
      let image = new kakao.maps.MarkerImage(CafeBig, imageSize, imageOptions);
      const marker = new kakao.maps.Marker({
        position,
        image,
      });
      if (globarMap) marker.setMap(globarMap);
      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedId((prev: any) => {
          return {
            img: m.photoUrl,
            title: m.placeName,
            address: m.jibunAddress,
            id: m.mungpleId,
            prevId: prev.id,
            detailUrl: m.detailUrl,
            instaUrl: m.instaUrl,
            lat: parseFloat(m.latitude),
            lng: parseFloat(m.longitude),
            categoryCode: m.categoryCode,
            prevLat: prev.lat,
            prevLng: prev.lng,
            prevCategoryCode: prev.categoryCode,
          };
        });
        if (m.categoryCode === 'CA0001') image = big2;
        else if (m.categoryCode === 'CA0002') image = big1;
        else if (m.categoryCode === 'CA0003') image = big3;
        else if (m.categoryCode === 'CA0004') image = big4;
        else if (m.categoryCode === 'CA0005') image = big5;
        else if (m.categoryCode === 'CA0006') image = big6;
        else image = big7;
        marker.setImage(image);
        if (m.categoryCode === 'CA0001') image = small2;
        else if (m.categoryCode === 'CA0002') image = small1;
        else if (m.categoryCode === 'CA0003') image = small3;
        else if (m.categoryCode === 'CA0004') image = small4;
        else if (m.categoryCode === 'CA0005') image = small5;
        else if (m.categoryCode === 'CA0006') image = small6;
        else image = small7;
        selectedMarker?.setImage(image);
        setSelectedMarker(marker);
      });
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
      {selectedId.title.length > 0 && (
        <PlaceCard
          id={selectedId.id}
          img={selectedId.img}
          title={selectedId.title}
          address={selectedId.address}
          categoryCode={selectedId.categoryCode}
          detailUrl={selectedId.detailUrl}
          instaUrl={selectedId.instaUrl}
        />
      )}
      {selectedId.title.length === 0 && selectedCert.placeName.length === 0 && (
        <FooterNavigation setCenter={setCurrentMapPosition} />
      )}
    </div>
  );
}

export default MapTest;
