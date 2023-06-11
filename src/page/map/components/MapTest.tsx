import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Map.scss';
import { getMapData } from '../../../common/api/record';
import { RootState } from '../../../redux/store';
import { Cert, certDefault, Mungple } from './maptype';
import FooterNavigation from '../../../components/FooterNavigation';
import { mapAction } from '../../../redux/slice/mapSlice';
import Logo from '../../../common/icons/logo.svg';
import PlaceCard from './PlaceCard';
import TempMarkerImageLoader, {
  clearSelectedId,
  MarkerImages,
  setMarkerImageBig,
  setMarkerImageSmall,
  setNormalCertMarker,
  setOtherNormalCertMarker,
} from './MarkerSet';
import SearchBar from './SearchBar';
import Search from '../../../common/icons/search.svg';
import { MY_ACCOUNT_PATH, SIGN_IN_PATH } from '../../../common/constants/path.const';
import Human from '../../../common/icons/human.svg';
import AlertConfirm from '../../../common/dialog/AlertConfirm';
import LinkCopy from './LinkCopy';
import CertToggle from './CertToggle';
import CertCard from './CertCard';
import BallLoading from '../../../common/utils/BallLoading';
import Marker from '../../../common/icons/cert-map-marker.svg';

interface MakerItem {
  id: number;
  marker: kakao.maps.Marker;
}

function MapTest() {
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const idDefault = useSelector((state: RootState) => state.map.selectedId);
  const toggleDefault = useSelector((state: RootState) => state.map.certToggle);
  const [isCertVisible, setIsCertVisible] = useState(toggleDefault);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isFirst, setIsFirst] = useState({ mungple: true, cert: true });
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const initMapCenter = useSelector((state: RootState) => state.map);
  const [globarMap, setGlobarMap] = useState<kakao.maps.Map>();
  const [selectedId, setSelectedId] = useState(idDefault);
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
  const [copyLoading, setCopyLoading] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<kakao.maps.Marker>();
  const [address, setAddress] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [pointerLocation, setPointerLocation] = useState({ lat: 0, lng: 0 });
  const [normalCertMarkerList, setNormalCertMarkerList] = useState<
    kakao.maps.CustomOverlay[]
  >([]);
  const [mungpleCertMarkerList, setMungpleCertMarkerList] = useState<
    kakao.maps.CustomOverlay[]
  >([]);
  const [otherCertMarkerList, setOtherCertMarkerList] = useState<
    kakao.maps.CustomOverlay[]
  >([]);
  const [otherMungpleCertMarkerList, setOtherMungpleCertMarkerList] = useState<
    kakao.maps.CustomOverlay[]
  >([]);
  const [linkId, setLinkId] = useState(NaN);
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const clearId = clearSelectedId(setSelectedId, selectedId);

  const { data: mapDataList, isFetched } = useQuery(['getMapData', userId], () =>
    getMapData(userId),
  );

  console.log(mapDataList);

  useEffect(() => { // 지도에 temp 마커 찍기
    const options = {
      center: new kakao.maps.LatLng(initMapCenter.lat, initMapCenter.lng),
      level: initMapCenter.zoom,
    };
    if (!mapElement.current) return;
    const map = new kakao.maps.Map(mapElement.current, options);
    setGlobarMap(map);
    kakao.maps.event.addListener(map, 'click', (e: kakao.maps.event.MouseEvent) => {

      setIsSelected(prevIsSelected => {
        if (prevIsSelected) { // 이미 찍힌 곳이 있다면 clear
          setPointerLocation(() => {
            return { lat: 0, lng: 0 };
          });
          clearId();
          setSelectedCert(certDefault);
        } else { // 현재 찍힌 곳의 위도 경도를 pointerLocation에 저장
          setPointerLocation(() => {
            return { lat: e.latLng.getLat(), lng: e.latLng.getLng() };
          });
          setSelectedCert(certDefault);
        }
        return !prevIsSelected;
      });
    });
    const loadMarkerImages = async () => {
      const loadedImages = MarkerImages();
    };
    loadMarkerImages();

    const parts = window.location.pathname.split('/');
    const id = parts[parts.length - 1];
    setLinkId(parseInt(id, 10));
  }, []);

  useEffect(() => {
    if (currentMarker) {
      currentMarker.setMap(null); // 현재 지도에 찍힌 temp 마커 삭제
    }
    const position = new kakao.maps.LatLng(pointerLocation.lat, pointerLocation.lng);
    const imageSize = new kakao.maps.Size(40, 40);
    const imageOptions = {
      offset: new kakao.maps.Point(20, 40)
    }
    const image = new kakao.maps.MarkerImage(Marker, imageSize, imageOptions);
    const marker = new kakao.maps.Marker({
      position,
      image
    });
    if (globarMap) marker.setMap(globarMap);
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
    dispatch(mapAction.setMapCustomPosition(pointerLocation));
  }, [pointerLocation]);

  useEffect(()=>{
    if(selectedCert.userId !== 0){
      setPointerLocation(() => {
        return { lat: 0, lng: 0 };
      });
      setIsSelected(false);
      clearId();
    }
  },[selectedCert]);

  const deleteMungpleList = () => {
    markerList.forEach((marker) => {
      marker.marker.setVisible(false);
    });
  };

  const showMungpleList = () => {
    markerList.forEach((marker) => {
      marker.marker.setVisible(true);
    });
  };

  const showCertList = (certList: kakao.maps.CustomOverlay[]) => {
    certList.forEach((cert) => cert.setVisible(true));
  };

  const deleteCertList = (certList: kakao.maps.CustomOverlay[]) => {
    certList.forEach((cert) => cert.setVisible(false));
  };

  const selectIdFunc = (prev: any, m: any) => {
    return {
      img: m.photoUrl,
      title: m.placeName,
      address: m.address,
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
  };

  useEffect(() => {
    if (mapDataList && (isFirst.cert || isFirst.mungple)) {
      if (userId > 0 && isCertVisible) {
        deleteMungpleList();
        deleteCertList(otherCertMarkerList);
        deleteCertList(otherMungpleCertMarkerList);
        if (globarMap && mapDataList) {
          const normalMarkers = setNormalCertMarker(
            mapDataList.normalCertList,
            globarMap,
            setSelectedCert,
          );
          setNormalCertMarkerList(normalMarkers);
          const certMarkers = setNormalCertMarker(
            mapDataList.mungpleCertList,
            globarMap,
            setSelectedCert,
          );
          setMungpleCertMarkerList(certMarkers);
        }
        setIsFirst((prev) => {
          return { ...prev, cert: false };
        });
      } else {
        deleteCertList(normalCertMarkerList);
        deleteCertList(mungpleCertMarkerList);
        if (
          globarMap &&
          otherCertMarkerList.length === 0 &&
          otherMungpleCertMarkerList.length === 0
        ) {
          const otherMarkers = setOtherNormalCertMarker(
            mapDataList.exposedNormalCertList,
            globarMap,
            navigate,
            setCurrentMapPosition,
          );
          setOtherCertMarkerList(otherMarkers);
          const otherMungpleMarkers = setOtherNormalCertMarker(
            mapDataList.exposedMungpleCertList,
            globarMap,
            navigate,
            setCurrentMapPosition,
          );
          setOtherMungpleCertMarkerList(otherMungpleMarkers);
        }
        if (globarMap && markerList.length === 0) {
          const markers = mapDataList.mungpleList.map((m) => {
            const position = new kakao.maps.LatLng(
              parseFloat(m.latitude),
              parseFloat(m.longitude),
            );
            let image = setMarkerImageSmall(m.categoryCode);
            const marker = new kakao.maps.Marker({
              position,
              image,
              zIndex: 10,
            });
            marker.setMap(globarMap);
            kakao.maps.event.addListener(marker, 'click', async () => {
              setSelectedId((prev: any) => {
                return selectIdFunc(prev, m);
              });
              setIsSelected(true);
              setPointerLocation({ lat: 0, lng: 0 });
              image = setMarkerImageBig(m.categoryCode);
              marker.setImage(image);
              marker.setZIndex(20);
            });
            return { marker, id: m.mungpleId };
          });
          setMarkerList(markers);
          setIsFirst((prev) => {
            return { ...prev, mungple: false };
          });
        }
      }
    }
    if (!isFirst.mungple && !isFirst.cert && mapDataList) {
      if (isCertVisible) {
        deleteMungpleList();
        deleteCertList(otherCertMarkerList);
        deleteCertList(otherMungpleCertMarkerList);
        showCertList(normalCertMarkerList);
        showCertList(mungpleCertMarkerList);
      } else {
        deleteCertList(normalCertMarkerList);
        deleteCertList(mungpleCertMarkerList);
        showMungpleList();
        showCertList(otherMungpleCertMarkerList);
        showCertList(otherCertMarkerList);
      }
    }
  }, [globarMap, mapDataList, isCertVisible]);

  useEffect(() => {
    dispatch(mapAction.setSelectedId(selectedId));
    if (selectedId.prevId === selectedId.id) return;
    if (selectedId.prevId > 0 && markerList.length > 0) {
      const index = markerList.findIndex((e) => {
        return e.id === selectedId.prevId;
      });
      const image = setMarkerImageSmall(selectedId.prevCategoryCode);
      markerList[index].marker.setImage(image);
      markerList[index].marker.setZIndex(10);
    }
  }, [selectedId]);

  useEffect(() => {
    if ((linkId > 0 || idDefault.id > 0) && mapDataList && !isFirst.mungple) {
      const { mungpleList } = mapDataList;
      let index: number;
      if (linkId > 0)
        index = mungpleList.findIndex((mungple) => mungple.mungpleId === linkId);
      else index = mungpleList.findIndex((mungple) => mungple.mungpleId === idDefault.id);
      if (index >= 0) {
        setSelectedId((prev: any) => {
          return selectIdFunc(prev, mungpleList[index]);
        });
        if (linkId > 0) {
          globarMap?.panTo(
            new kakao.maps.LatLng(
              parseFloat(mungpleList[index].latitude),
              parseFloat(mungpleList[index].longitude),
            ),
          );
        }
        const image = setMarkerImageBig(mungpleList[index].categoryCode);
        markerList[index].marker.setImage(image);
        markerList[index].marker.setZIndex(20);
      }
      setLinkId(NaN);
    }
  }, [isFirst.mungple]);

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
    dispatch(mapAction.setCertToggle(false));
    setSearchIsOpen(false);
    setIsCertVisible(false);
    setSelectedId((prev: any) => {
      return selectIdFunc(prev, data);
    });
    const image = await setMarkerImageBig(data.categoryCode);

    const index = markerList.findIndex((marker) => {
      return marker.id === data.mungpleId;
    });
    markerList[index].marker.setImage(image);
    markerList[index].marker.setZIndex(20);
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
      <img className="map-logo" aria-hidden src={Logo} alt="logo" onClick={clearId} />
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
        <SearchBar
          selectId={searchSelectId}
          cafeList={mapDataList!.mungpleList}
          close={searchClose}
        />
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
          map={globarMap}
        />
      )}
      {selectedCert.userId > 0 && (
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
      {selectedId.title.length === 0 && selectedCert.userId === 0 && (
        <FooterNavigation setCenter={setCurrentMapPosition} />
      )}
      {!(selectedId.title.length > 0 || selectedCert.userId > 0) && (
        <CertToggle onClick={onClickCertToggle} state={isCertVisible} />
      )}
      {selectedId.title.length > 0 && <LinkCopy isMungple setLoading={setCopyLoading} redirect={setIsAlertOpen} />}
      {(isSelected && selectedId.title.length === 0) && <LinkCopy isMungple={false} setLoading={setCopyLoading} redirect={setIsAlertOpen} />}
      {copyLoading && <BallLoading />}
      <TempMarkerImageLoader />
    </div>
  );
}

export default MapTest;
