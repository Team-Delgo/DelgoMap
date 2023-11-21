import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useQuery } from 'react-query';
import { MungpleMap, getCerts, getMungple } from 'common/api/record';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { mapAction } from 'redux/slice/mapSlice';
import { MY_ACCOUNT_PATH, SIGN_IN_PATH } from 'common/constants/path.const';
import {
  clearSelectedId,
  setMarkerImageBig,
  setMarkerImageSmall,
  setNormalCertMarker,
} from './components/MarkerSet';
import {
  Cert,
  MungpleMarkerType,
  SelectedMungple,
  certDefault,
  defaultSelectedMungple,
} from './index.types';
import DogFootMarkerSvg from '../../common/icons/cert-map-marker.svg';

function useMap() {
  /** Variable */
  const mapElement = useRef(null);
  const navigate = useNavigate();

  /** Store */
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const initialMapCenter = useSelector((state: RootState) => state.map);
  // const initialSelectedMungple = useSelector((state: RootState) => state.map.selectedId);
  const initialCertMungpleToggle = useSelector(
    (state: RootState) => state.map.certToggle,
  );

  /** Local State */
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSearchViewOpen, setIsSearchViewOpen] = useState(false);
  const [isSelectedAnything, setIsSelectedAnything] = useState(false);
  const [dogFootMarkerLocation, setDogFootMarkerLocation] = useState({ lat: 0, lng: 0 });
  const [selectedMungple, setSelectedMungple] =
    useState<SelectedMungple>(defaultSelectedMungple);
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFirstRendering, setIsFirstRendering] = useState({ mungple: true, cert: true });
  const [isCertToggleOn, setIsCertToggleOn] = useState(initialCertMungpleToggle);
  // Markers
  const [dogFootMarker, setDogFootMarker] = useState<kakao.maps.Marker>();
  const [mungpleMarkers, setMungpleMarkers] = useState<MungpleMarkerType[]>([]);
  const [certMarkers, setCertMarkers] = useState<kakao.maps.CustomOverlay[]>([]);
  const [mungpleCertMarkers, setMungpleCertMarkers] = useState<
    kakao.maps.CustomOverlay[]
  >([]);

  /** API request */
  const { data: mapDataList } = useQuery(
    ['getMapData', userId],
    () => getMungple(userId),
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: certDataList } = useQuery(['getCertData', userId], () =>
    getCerts(userId),
  );

  const viewCount: number = certDataList ? certDataList.viewCount : 0;

  /** Function */
  const clearSelectedMungple = clearSelectedId(setSelectedMungple, selectedMungple);
  const clearSelectedCert = () => setSelectedCert(certDefault);
  const dispatchSelectedMungple = (prev: SelectedMungple, mungple: any) => {
    console.log(prev, mungple);
    return {
      img: mungple.photoUrl,
      title: mungple.placeName,
      address: mungple.address,
      id: mungple.mungpleId,
      prevId: prev.id,
      detailUrl: mungple.detailUrl,
      lat: parseFloat(mungple.latitude),
      lng: parseFloat(mungple.longitude),
      categoryCode: mungple.categoryCode,
      prevCategoryCode: prev.categoryCode,
      isBookmarked: mungple.isBookmarked,
      prevIsBookmarked: prev.isBookmarked,
    };
  };
  // 현재 지도 위치 + 줌 레벨 저장
  const setCurrentMapLocation = () => {
    const center = map?.getCenter();
    const zoom = map?.getLevel();
    dispatch(
      mapAction.setCurrentPosition({
        lat: center?.getLat(),
        lng: center?.getLng(),
        zoom,
      }),
    );
  };

  // EventListener handlers
  const listboxHandler = () => {
    const center = map?.getCenter();
    const lat = `${center?.getLat()}`;
    const lng = `${center?.getLng()}`;
    return { lat, lng };
  };

  const mapClickHandler = (e: kakao.maps.event.MouseEvent) => {
    setIsSelectedAnything((prev) => {
      if (prev) {
        setDogFootMarkerLocation(() => ({ lat: 0, lng: 0 }));
        clearSelectedMungple();
      } else {
        setDogFootMarkerLocation(() => ({
          lat: e.latLng.getLat(),
          lng: e.latLng.getLng(),
        }));
      }
      clearSelectedCert();
      return !prev;
    });
  };
  const markerClickHandler = (
    marker: kakao.maps.Marker,
    image: kakao.maps.MarkerImage,
    mungple: any,
  ) => {
    setSelectedMungple((prev) => dispatchSelectedMungple(prev, mungple));
    setIsSelectedAnything(true);
    if (mungple.isBookmarked) image = setMarkerImageBig('BOOKMARK');
    else image = setMarkerImageBig(mungple.categoryCode);
    marker.setImage(image);
    marker.setZIndex(20);
    setDogFootMarkerLocation(() => ({ lat: 0, lng: 0 }));
  };
  // Markers visible handlers
  const hideMungpleMarkers = () => {
    mungpleMarkers.forEach((marker) => marker.marker.setVisible(false));
  };
  const hideCertMarkers = (certMarkers: kakao.maps.CustomOverlay[]) => {
    certMarkers.forEach((marker) => marker.setVisible(false));
  };
  const showMungpleMarkers = () => {
    if (selectedCategory === 'BOOKMARK') {
      mungpleMarkers.forEach((marker) => {
        if (marker.isBookmarked) marker.marker.setVisible(true);
        else marker.marker.setVisible(false);
      });
    } else {
      mungpleMarkers.forEach((marker) => {
        if (selectedCategory === '' || marker.category === selectedCategory)
          marker.marker.setVisible(true);
        else marker.marker.setVisible(false);
      });
    }
  };
  const showCertMarkers = (certMarkers: kakao.maps.CustomOverlay[]) => {
    certMarkers.forEach((marker) => marker.setVisible(true));
  };

  // Search handlers
  const openSearchView = () => setIsSearchViewOpen(true);
  const closeSearchView = () => setIsSearchViewOpen(false);

  const searchAndMoveToKakaoPlace = (location: kakao.maps.LatLng) => {
    setIsSearchViewOpen(false);
    setIsCertToggleOn(false);
    clearSelectedMungple();
    clearSelectedCert();
    setDogFootMarkerLocation(() => ({ lat: location.getLat(), lng: location.getLng() }));
    setIsSelectedAnything(true);
    map?.panTo(location);
  };

  const searchAndMoveToMungple = (mungple: MungpleMap) => {
    dispatch(mapAction.setCertToggle(false));
    setIsSearchViewOpen(false);
    setIsCertToggleOn(false);
    setSelectedMungple((prev) => dispatchSelectedMungple(prev, mungple));

    const image = setMarkerImageBig(mungple.categoryCode);
    const index = mungpleMarkers.findIndex((marker) => marker.id === mungple.mungpleId);
    mungpleMarkers[index].marker.setImage(image);
    mungpleMarkers[index].marker.setZIndex(20);
    map?.panTo(
      new kakao.maps.LatLng(parseFloat(mungple.latitude), parseFloat(mungple.longitude)),
    );
  };

  // Navigate handlers
  const navigateToMyaccountPage = () => {
    if (userId > 0) {
      setCurrentMapLocation();
      navigate(MY_ACCOUNT_PATH.MAIN);
    } else setIsAlertOpen(true);
  };
  const navigateToLoginPage = () => navigate(SIGN_IN_PATH.MAIN);

  // Toggle handlers
  const certToggleClickHandler = () => {
    if (userId === 0) setIsAlertOpen(true);
    else {
      setIsCertToggleOn((prev) => !prev);
      dispatch(mapAction.setCertToggle(!isCertToggleOn));
    }
  };
  const { state: certLocationState } = useLocation();

  /** Rendering */
  // 지도 생성
  useEffect(() => {
    const options = {
      center: new kakao.maps.LatLng(initialMapCenter.lat, initialMapCenter.lng),
      level: initialMapCenter.zoom,
    };
    if (!mapElement.current) return;
    const map = new kakao.maps.Map(mapElement.current, options);
    setMap(map);
  }, []);

  // 지도 클릭 이벤트 설정 (클릭 시 해당 좌표 저장)
  useEffect(() => {
    if (!map) return;
    kakao.maps.event.addListener(map, 'click', mapClickHandler);
  }, [map]);

  // 지도 클릭 시 마커 렌더링
  useEffect(() => {
    if (dogFootMarker) dogFootMarker.setMap(null);
    const position = new kakao.maps.LatLng(
      dogFootMarkerLocation.lat,
      dogFootMarkerLocation.lng,
    );
    const imageSize = new kakao.maps.Size(40, 40);
    const imageOptions = { offset: new kakao.maps.Point(20, 40) };
    const image = new kakao.maps.MarkerImage(DogFootMarkerSvg, imageSize, imageOptions);
    const marker = new kakao.maps.Marker({ position, image });

    if (map) marker.setMap(map);
    setDogFootMarker(marker);
    if (dogFootMarkerLocation.lat !== 0) {
      naver.maps.Service.reverseGeocode(
        {
          coords: new naver.maps.LatLng(
            dogFootMarkerLocation.lat,
            dogFootMarkerLocation.lng,
          ),
        },
        (status, response) => {
          const result = response.v2;
          dispatch(mapAction.setSelectedIdAddress(result.address.jibunAddress));
        },
      );
    }
    dispatch(mapAction.setMapCustomPosition(dogFootMarkerLocation));
  }, [dogFootMarkerLocation]);

  // 멍플, 인증 마커 렌더링
  useEffect(() => {
    if (mapDataList && map && (isFirstRendering.mungple || isFirstRendering.cert)) {
      if (userId > 0 && isCertToggleOn && certDataList) {
        console.log(certDataList.content);
        // hide other certs markers
        hideMungpleMarkers();
        // 일반 인증 마커 만들기
        const certMarkers = setNormalCertMarker(
          certDataList.content,
          map,
          setSelectedCert,
        );
        // 멍플 인증 마커 만들기
        // const mungpleCertMarkers = setNormalCertMarker(
        //   mapDataList.mungpleCertList,
        //   map,
        //   setSelectedCert,
        // );
        setCertMarkers(certMarkers);
        setMungpleCertMarkers(mungpleCertMarkers);
        setIsFirstRendering((prev) => ({ ...prev, cert: false }));
      } else if (mungpleMarkers.length === 0) {
        hideCertMarkers(certMarkers);
        hideCertMarkers(mungpleCertMarkers);
        // hideMungpleMarkers();

        const markers: MungpleMarkerType[] = mapDataList.map((mungple) => {
          const position = new kakao.maps.LatLng(
            parseFloat(mungple.latitude),
            parseFloat(mungple.longitude),
          );
          let image: kakao.maps.MarkerImage;
          if (mungple.isBookmarked) image = setMarkerImageSmall('BOOKMARK');
          else image = setMarkerImageSmall(mungple.categoryCode);

          const marker = new kakao.maps.Marker({ position, image, zIndex: 10 });
          marker.setMap(map);
          kakao.maps.event.addListener(marker, 'click', () =>
            markerClickHandler(marker, image, mungple),
          );
          return {
            id: mungple.mungpleId,
            category: mungple.categoryCode,
            marker,
            isBookmarked: mungple.isBookmarked,
          };
        });
        setMungpleMarkers(markers);
        setIsFirstRendering((prev) => ({ ...prev, mungple: false }));
      }
    }
    if (!isFirstRendering.mungple && !isFirstRendering.cert && mapDataList) {
      if (isCertToggleOn) {
        hideMungpleMarkers();
        showCertMarkers(certMarkers);
        showCertMarkers(mungpleCertMarkers);
      } else {
        hideCertMarkers(certMarkers);
        hideCertMarkers(mungpleCertMarkers);
        showMungpleMarkers();
      }
    }
  }, [map, mapDataList, isCertToggleOn]);

  // 새로운 마커 선택 시 이전 선택된 마커는 원래 이미지로 되돌아감 big -> small
  useEffect(() => {
    dispatch(mapAction.setSelectedId(selectedMungple));
    if (selectedMungple.prevId === selectedMungple.id) return;
    if (selectedMungple.prevId > 0 && mungpleMarkers.length > 0) {
      const index = mungpleMarkers.findIndex(
        (marker) => marker.id === selectedMungple.prevId,
      );
      const image = selectedMungple.prevIsBookmarked
        ? setMarkerImageSmall('BOOKMARK')
        : setMarkerImageSmall(selectedMungple.prevCategoryCode);
      mungpleMarkers[index].marker.setImage(image);
      mungpleMarkers[index].marker.setZIndex(10);
    }
  }, [selectedMungple]);

  // 카테고리 선택 시
  useEffect(() => {
    showMungpleMarkers();
  }, [selectedCategory]);

  //cert or record에서 제목 클릭시
  useEffect(() => {
    if (map && certLocationState) {
      setIsCertToggleOn(false);
      map?.panTo(new kakao.maps.LatLng(certLocationState.lat, certLocationState.lng));
      if (certLocationState.certMungpleId) {
        const targetMungple = mapDataList?.find((item) => {
          return item.mungpleId === certLocationState.certMungpleId;
        });

        if (targetMungple && mungpleMarkers.length > 0) {
          //멍플일때
          setSelectedMungple((prev) => dispatchSelectedMungple(prev, targetMungple));
          setIsSelectedAnything(true);
          const image = setMarkerImageBig(targetMungple.categoryCode);
          const index = mungpleMarkers.findIndex(
            (marker) => marker.id === targetMungple.mungpleId,
          );
          mungpleMarkers[index].marker.setImage(image);
          mungpleMarkers[index].marker.setZIndex(20);
          setDogFootMarkerLocation(() => ({ lat: 0, lng: 0 }));
        }
      } else {
        //멍플 아닐떄
        setDogFootMarkerLocation(() => ({
          lat: certLocationState.lat,
          lng: certLocationState.lng,
        }));
        setSelectedCert(certLocationState.cert);
      }
    }
  }, [map, certLocationState, mungpleMarkers]);
  return {
    state: {
      map,
      mapElement,
      mapDataList,
      selectedCategory,
      selectedCert,
      selectedMungple,
      mungpleMarkers,
      viewCount,
      isSearchViewOpen,
      isAlertOpen,
      isSelectedAnything,
      isCertToggleOn,
    },
    action: {
      openSearchView,
      listboxHandler,
      closeSearchView,
      searchAndMoveToMungple,
      setIsAlertOpen,
      setSelectedCategory,
      navigateToMyaccountPage,
      navigateToLoginPage,
      certToggleClickHandler,
      setCurrentMapLocation,
      searchAndMoveToKakaoPlace,
    },
  };
}

export default useMap;
