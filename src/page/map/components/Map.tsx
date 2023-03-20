import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useAnalyticsLogEvent,
  useAnalyticsCustomLogEvent,
} from '@react-query-firebase/analytics';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Map.scss';
import { getMapData } from '../../../common/api/record';
import { Mungple, idDefault, Cert, certDefault } from './maptype';
import PlaceCard from './PlaceCard';
import { analytics } from '../../../index';
import {
  setMarkerOptionBig,
  setMarkerOptionSmall,
  setMarkerOptionPrev,
  setCertNormalMarker,
  setCertMungpleMarker,
  setOtherDogsMungple,
} from './MapComponent';
import SearchBar from './SearchBar';
import LinkCopy from './LinkCopy';
import Search from '../../../common/icons/search.svg';
import Logo from '../../../common/icons/logo.svg';
import { mapAction } from '../../../redux/slice/mapSlice';
import DetailPage from '../../../page/DetailPage';
import FooterNavigation from '../../../components/FooterNavigation';
import CertToggle from './CertToggle';
import Human from '../../../common/icons/human.svg';
import { MY_ACCOUNT_PATH, SIGN_IN_PATH } from '../../../common/constants/path.const';
import { RootState } from '../../../redux/store';
import AlertConfirm from '../../../common/dialog/AlertConfirm';
import CertCard from './CertCard';

interface MakerItem {
  id: number;
  marker: naver.maps.Marker;
}

function Map() {
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleDefault = useSelector((state: RootState) => state.map.certToggle);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [globarMap, setGlobarMap] = useState<naver.maps.Map>();
  const [selectedId, setSelectedId] = useState(idDefault);
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);
  const [mungpleList, setMungpleList] = useState<Mungple[]>([]);
  const [mungpleCertList, setMunpleCertList] = useState<Cert[]>([]);
  const [normalCertList, setNormalCertList] = useState<Cert[]>([]);
  const [otherMungpleCertList, setOtherMungpleCertList] = useState<Cert[]>([]);
  const [otherNormalCertList, setOtherNormalCertList] = useState<Cert[]>([]);
  const [mungpleCertMarkerList, setMungpleCertMarkerList] = useState<naver.maps.Marker[]>(
    [],
  );
  const [otherCertMungpleMarkerList, setOtherCertMungpleMarkerList] = useState<naver.maps.Marker[]>([]);
  const [certMarkerList, setCertMarkerList] = useState<naver.maps.Marker[]>([]);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
  const [detailUrl, setDetailUrl] = useState('');
  const [linkId, setLinkId] = useState(NaN);
  const [isCertVisible, setIsCertVisible] = useState(toggleDefault);
  const initMapCenter = useSelector((state: RootState) => state.map);
  const [currentLocation, setCurrentLocation] = useState({
    lat: !initMapCenter.lat ? 37.5057018 : initMapCenter.lat,
    lng: !initMapCenter.lng ? 127.1141119 : initMapCenter.lng,
    zoom: !initMapCenter.zoom ? 14 : initMapCenter.zoom,
    option: { zoom: 2, size: 70 },
  });
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const mungpleClickEvent = useAnalyticsCustomLogEvent(analytics, 'map_mungple');
  let map: naver.maps.Map;
  const routerLocation = useLocation();

  const clearSelectedId = useCallback(() => {
    setSelectedId((prev: any) => {
      return {
        img: '',
        title: '',
        address: '',
        id: 0,
        prevId: prev.id,
        lat: 0,
        detailUrl: '',
        instaUrl: '',
        lng: 0,
        categoryCode: '0',
        prevLat: prev.lat,
        prevLng: prev.lng,
        prevCategoryCode: prev.categoryCode,
      };
    });
  }, [selectedId]);

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
    document.body.style.overflow = 'hidden';
    mutation.mutate({
      params: {
        firebase_screen: 'Map',
        firebase_screen_class: 'MapPage',
      },
    });
    getMapPageData();
    if (!mapElement.current || !naver) return;
    const location = new window.naver.maps.LatLng(
      currentLocation.lat,
      currentLocation.lng,
    );
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: currentLocation.zoom,
      zoomControl: false,
      minZoom: 10,
      logoControl: false,
    };

    map = new naver.maps.Map(mapElement.current, mapOptions);
    setGlobarMap(map);
    naver.maps.Event.addListener(map, 'click', (e) => {
      clearSelectedId();
      setSelectedCert(certDefault);
    });
    setLinkId(parseInt(routerLocation.pathname.slice(1), 10));
    return () => {
      document.body.style.overflow = 'scroll';
    };
  }, []);

  const deleteMungpleList = () => {
    markerList.forEach((marker) => {
      marker.marker.setMap(null);
    });
  };

  const deleteMarkers = (markers: naver.maps.Marker[]) => {
    markers.forEach((marker) => {
      marker.setMap(null);
    })
  }

  useEffect(() => {
    if (userId > 0 && isCertVisible) {
      deleteMungpleList();
      deleteMarkers(otherCertMungpleMarkerList);
      const tempList1 = setCertNormalMarker(normalCertList, globarMap, setSelectedCert);
      setCertMarkerList(tempList1);
      const tempList2 = setCertMungpleMarker(
        mungpleCertList,
        globarMap,
        currentLocation,
        setSelectedCert,
      );
      setMungpleCertMarkerList(tempList2);
    } else if (!isCertVisible) {
      deleteMarkers(certMarkerList);
      deleteMarkers(mungpleCertMarkerList);

      const tempOthers1 = setOtherDogsMungple(otherMungpleCertList, globarMap, navigate);
      setOtherCertMungpleMarkerList(tempOthers1);
      const tempList = mungpleList.map((data) => {
        let markerOptions: naver.maps.MarkerOptions;
        markerOptions = setMarkerOptionSmall(data.categoryCode, data, globarMap);
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
              detailUrl: data.detailUrl,
              instaUrl: data.instaUrl,
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude),
              categoryCode: data.categoryCode,
              prevLat: prev.lat,
              prevLng: prev.lng,
              prevCategoryCode: prev.categoryCode,
            };
          });
          markerOptions = setMarkerOptionBig(
            data.categoryCode,
            data,
            globarMap,
            selectedId.prevCategoryCode,
          );
          marker.setOptions(markerOptions);
        });
        return { marker, id: data.mungpleId };
      });
      setMarkerList(tempList);
    }
  }, [mungpleList, isCertVisible]);

  const searchSelectId = (data: Mungple) => {
    setSearchIsOpen(false);
    setSelectedId((prev: any) => {
      return {
        img: data.photoUrl,
        title: data.placeName,
        address: data.jibunAddress,
        id: data.mungpleId,
        prevId: prev.id,
        detailUrl: data.detailUrl,
        instaUrl: data.instaUrl,
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        categoryCode: data.categoryCode,
        prevLat: prev.lat,
        prevLng: prev.lng,
        prevCategoryCode: prev.categoryCode,
      };
    });
    const markerOptions = setMarkerOptionBig(
      data.categoryCode,
      data,
      globarMap,
      selectedId.prevCategoryCode,
    );
    const index = markerList.findIndex((marker) => {
      return marker.id === data.mungpleId;
    });
    markerList[index].marker.setOptions(markerOptions);
    globarMap?.morph(
      new naver.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude)),
      16,
      {
        duration: 500,
        easing: 'easeOutCubic',
      },
    );
  };

  useEffect(() => {
    if (selectedId.prevId === selectedId.id) return;
    if (selectedId.prevId > 0) {
      const index = markerList.findIndex((e) => {
        return e.id === selectedId.prevId;
      });
      const markerOptions = setMarkerOptionPrev(
        selectedId.prevCategoryCode,
        selectedId,
        globarMap,
      );
      markerList[index].marker.setOptions(markerOptions);
    }
  }, [selectedId]);

  useEffect(() => {
    if (linkId > 0 && markerList.length > 0) {
      const index = mungpleList.findIndex((mungple) => mungple.mungpleId === linkId);
      if (index >= 0) {
        setSelectedId((prev: any) => {
          return {
            img: mungpleList[index].photoUrl,
            title: mungpleList[index].placeName,
            address: mungpleList[index].jibunAddress,
            id: mungpleList[index].mungpleId,
            prevId: prev.id,
            detailUrl: mungpleList[index].detailUrl,
            instaUrl: mungpleList[index].instaUrl,
            lat: parseFloat(mungpleList[index].latitude),
            lng: parseFloat(mungpleList[index].longitude),
            categoryCode: mungpleList[index].categoryCode,
            prevLat: prev.lat,
            prevLng: prev.lng,
            prevCategoryCode: prev.categoryCode,
          };
        });
        globarMap?.panTo(
          new naver.maps.LatLng(
            parseFloat(mungpleList[index].latitude),
            parseFloat(mungpleList[index].longitude),
          ),
          {
            duration: 500,
            easing: 'easeOutCubic',
          },
        );
        const markerOptions = setMarkerOptionBig(
          mungpleList[index].categoryCode,
          mungpleList[index],
          globarMap,
          selectedId.prevCategoryCode,
        );
        markerList[index].marker.setOptions(markerOptions);
      }
      setLinkId(NaN);
    }
  }, [markerList]);

  const searchClickHander = useCallback(() => setSearchIsOpen(true), []);

  const searchClose = useCallback(() => setSearchIsOpen(false), []);

  const setCurrentMapPosition = () => {
    const center = globarMap?.getCenter();
    const zoom = globarMap?.getZoom();
    dispatch(mapAction.setCurrentPosition({ lat: center?.y, lng: center?.x, zoom }));
  };

  const onClickCertToggle = () => {
    setIsCertVisible((prev) => !prev);
    dispatch(mapAction.setCertToggle(!isCertVisible));
  };

  const navigateMyPage = useCallback(() => {
    if (isSignIn) {
      setCurrentMapPosition();
      navigate(MY_ACCOUNT_PATH.MAIN);
    } else setIsAlertOpen(true);
  }, [globarMap]);

  const sendLoginPage = useCallback(() => navigate(SIGN_IN_PATH.MAIN), []);

  const closeAlert = useCallback(() => setIsAlertOpen(false), []);

  return (
    <div className="map-wrapper">
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={sendLoginPage}
          noButtonHandler={closeAlert}
        />
      )}
      <div className="whiteBox" />
      <img className="map-logo" src={Logo} alt="logo" />
      <img
        className="map-search"
        src={Search}
        alt="search"
        aria-hidden="true"
        onClick={searchClickHander}
      />
      <img
        className="map-mypage"
        src={Human}
        alt="mypage"
        aria-hidden="true"
        onClick={navigateMyPage}
      />
      <div className="slogun">강아지 델고 동네생활</div>
      <div className="map" ref={mapElement} style={{ position: 'absolute' }} />
      {searchIsOpen && (
        <SearchBar selectId={searchSelectId} cafeList={mungpleList} close={searchClose} />
      )}
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
      {selectedCert.placeName.length > 0 && (
        <CertCard
          cert={selectedCert}
          img={selectedCert.photoUrl}
          title={selectedCert.placeName}
          categoryCode={selectedCert.categoryCode}
          registDt={selectedCert.registDt}
          description={selectedCert.description}
          setCenter={setCurrentMapPosition}
        />
      )}
      <CertToggle onClick={onClickCertToggle} state={isCertVisible} />
      {selectedId.title.length > 0 && <LinkCopy />}
      {detailUrl.length > 0 && <DetailPage />}
      {selectedId.title.length === 0 && selectedCert.placeName.length === 0 && (
        <FooterNavigation setCenter={setCurrentMapPosition} />
      )}
    </div>
  );
}

export default Map;


