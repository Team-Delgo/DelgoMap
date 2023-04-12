import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import './Map.scss';
import { getMapData } from '../../../common/api/record';
import { RootState } from '../../../redux/store';
import { Cert, certDefault, idDefault, Mungple } from './maptype';
import FooterNavigation from '../../../components/FooterNavigation';
import { mapAction } from '../../../redux/slice/mapSlice';
import Logo from '../../../common/icons/logo.svg';
import PlaceCard from './PlaceCard';
import TempMarkerImageLoader, {
  clearSelectedId,
  MarkerImages,
  MarkerImageSets,
  setMarkerImageBig,
  setNormalCertMarker,
} from './MarkerSet';
import SearchBar from './SearchBar';
import Search from '../../../common/icons/search.svg';
import { MY_ACCOUNT_PATH, SIGN_IN_PATH } from '../../../common/constants/path.const';
import Human from '../../../common/icons/human.svg';
import AlertConfirm from '../../../common/dialog/AlertConfirm';
import LinkCopy from './LinkCopy';
import CertToggle from './CertToggle';

interface MakerItem {
  id: number;
  marker: kakao.maps.Marker;
}

function MapTest() {
  const [markerImages, setMarkerImages] = useState<MarkerImageSets>({
    images: [],
    smallImages: [],
  });
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const toggleDefault = useSelector((state: RootState) => state.map.certToggle);
  const [isCertVisible, setIsCertVisible] = useState(toggleDefault);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const initMapCenter = useSelector((state: RootState) => state.map);
  const [globarMap, setGlobarMap] = useState<kakao.maps.Map>();
  const [mungpleList, setMungpleList] = useState<Mungple[]>([]);
  const [selectedId, setSelectedId] = useState(idDefault);
  const [selectedMarker, setSelectedMarker] = useState<kakao.maps.Marker>();
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
  const [mungpleCertList, setMunpleCertList] = useState<Cert[]>([]);
  const [normalCertList, setNormalCertList] = useState<Cert[]>([]);
  const [otherMungpleCertList, setOtherMungpleCertList] = useState<Cert[]>([]);
  const [otherNormalCertList, setOtherNormalCertList] = useState<Cert[]>([]);
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const clearId = clearSelectedId(setSelectedId, selectedId);

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
      level: 5,
    };
    if (!mapElement.current) return;
    const map = new kakao.maps.Map(mapElement.current, options);
    setGlobarMap(map);
    kakao.maps.event.addListener(map, 'click', clearId);
    const loadMarkerImages = async () => {
      const loadedImages = await MarkerImages();
      setMarkerImages(loadedImages);
    };
    loadMarkerImages();
  }, []);

  const { images: bigMarker, smallImages: smallMarker } = markerImages;
  const [big1, big2, big3, big4, big5, big6, big7] = bigMarker;
  const [small1, small2, small3, small4, small5, small6, small7] = smallMarker;

  const deleteMungpleList = () => {
    markerList.forEach((marker) => {
      marker.marker.setMap(null);
    });
  };

  useEffect(() => {
    if(userId > 0 && isCertVisible){
      deleteMungpleList();
      if(globarMap){
        const normalMarkers = setNormalCertMarker(normalCertList, globarMap);
      }
    }
    const markers = mungpleList.map((m) => {
      const position = new kakao.maps.LatLng(
        parseFloat(m.latitude),
        parseFloat(m.longitude),
      );
      let image;
      if (m.categoryCode === 'CA0001') image = small2;
      else if (m.categoryCode === 'CA0002') image = small1;
      else if (m.categoryCode === 'CA0003') image = small3;
      else if (m.categoryCode === 'CA0004') image = small4;
      else if (m.categoryCode === 'CA0005') image = small5;
      else if (m.categoryCode === 'CA0006') image = small6;
      else image = small7;
      const marker = new kakao.maps.Marker({
        position,
        image,
        zIndex: 10,
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
        marker.setZIndex(20);
      });
      return { marker, id: m.mungpleId };
    });
    setMarkerList(markers);
  }, [mungpleList,isCertVisible]);

  useEffect(() => {
    if (selectedId.prevId === selectedId.id) return;
    if (selectedId.prevId > 0) {
      const index = markerList.findIndex((e) => {
        return e.id === selectedId.prevId;
      });
      let image: kakao.maps.MarkerImage;
      if (selectedId.prevCategoryCode === 'CA0001') image = small2;
      else if (selectedId.prevCategoryCode === 'CA0002') image = small1;
      else if (selectedId.prevCategoryCode === 'CA0003') image = small3;
      else if (selectedId.prevCategoryCode === 'CA0004') image = small4;
      else if (selectedId.prevCategoryCode === 'CA0005') image = small5;
      else if (selectedId.prevCategoryCode === 'CA0006') image = small6;
      else image = small7;
      markerList[index].marker.setImage(image);
      markerList[index].marker.setZIndex(10);
    }
  }, [selectedId]);

  const searchClose = useCallback(() => setSearchIsOpen(false), []);

  const setCurrentMapPosition = () => {
    const center = globarMap!.getCenter();
    const zoom = globarMap?.getLevel();
    dispatch(
      mapAction.setCurrentPosition({
        lat: center?.getLat(),
        lng: center?.getLng(),
        zoom,
      }),
    );
  };

  const searchSelectId = async (data: Mungple) => {
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
    const image = await setMarkerImageBig(data.categoryCode);

    const index = markerList.findIndex((marker) => {
      return marker.id === data.mungpleId;
    });
    markerList[index].marker.setImage(image);
    globarMap?.panTo(
      new kakao.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude)),
    );
  };

  const navigateMyPage = useCallback(() => {
    if (isSignIn) {
      setCurrentMapPosition();
      navigate(MY_ACCOUNT_PATH.MAIN);
    } else setIsAlertOpen(true);
  }, [globarMap]);

  const searchClickHander = useCallback(() => setSearchIsOpen(true), []);

  const sendLoginPage = useCallback(() => navigate(SIGN_IN_PATH.MAIN), []);

  const closeAlert = useCallback(() => setIsAlertOpen(false), []);

  const onClickCertToggle = () => {
    if (!isSignIn) setIsAlertOpen(true);
    else {
      setIsCertVisible((prev) => !prev);
      dispatch(mapAction.setCertToggle(!isCertVisible));
    }
  };

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
      <div className="map" ref={mapElement} />
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
      {selectedId.title.length === 0 && selectedCert.placeName.length === 0 && (
        <FooterNavigation setCenter={setCurrentMapPosition} />
      )}
      {!(selectedId.title.length > 0 || selectedCert.placeName.length > 0) && (
        <CertToggle onClick={onClickCertToggle} state={isCertVisible} />
      )}
      {selectedId.title.length > 0 && <LinkCopy />}
      <TempMarkerImageLoader />
    </div>
  );
}

export default MapTest;
