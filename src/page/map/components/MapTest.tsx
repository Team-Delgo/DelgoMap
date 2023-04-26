import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  const [isFirst, setIsFirst] = useState({ mungple: true, cert: true });
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const initMapCenter = useSelector((state: RootState) => state.map);
  const [globarMap, setGlobarMap] = useState<kakao.maps.Map>();
  const [selectedId, setSelectedId] = useState(idDefault);
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
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

  useEffect(() => {
    const options = {
      center: new kakao.maps.LatLng(initMapCenter.lat, initMapCenter.lng),
      level: initMapCenter.zoom,
    };
    if (!mapElement.current) return;
    const map = new kakao.maps.Map(mapElement.current, options);
    setGlobarMap(map);
    kakao.maps.event.addListener(map, 'click', () => {
      clearId();
      setSelectedCert(certDefault);
    });
    const loadMarkerImages = async () => {
      const loadedImages = await MarkerImages();
      setMarkerImages(loadedImages);
    };
    loadMarkerImages();

    const parts = window.location.pathname.split('/');
    const id = parts[parts.length - 1];
    setLinkId(parseInt(id, 10));
  }, []);

  const deleteMungpleList = () => {
    markerList.forEach((marker) => {
      // marker.marker.setMap(null);
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
        if (globarMap) {
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
          if (globarMap) marker.setMap(globarMap);
          kakao.maps.event.addListener(marker, 'click', async () => {
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
    if (selectedId.prevId === selectedId.id) return;
    if (selectedId.prevId > 0) {
      const index = markerList.findIndex((e) => {
        return e.id === selectedId.prevId;
      });
      const image = setMarkerImageSmall(selectedId.prevCategoryCode);
      markerList[index].marker.setImage(image);
      markerList[index].marker.setZIndex(10);
    }
  }, [selectedId]);

  useEffect(() => {
    if (linkId > 0 && mapDataList && !isFirst.mungple) {
      const { mungpleList } = mapDataList;
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
          new kakao.maps.LatLng(
            parseFloat(mungpleList[index].latitude),
            parseFloat(mungpleList[index].longitude),
          ),
        );
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
