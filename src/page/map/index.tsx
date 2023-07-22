import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { getMapData } from '../../common/api/record';
import { RootState } from '../../redux/store';
import { Cert, certDefault, Mungple } from './index.types';
import FooterNavigation from '../../components/FooterNavigation';
import { mapAction } from '../../redux/slice/mapSlice';
import Logo from '../../common/icons/logo.svg';
import Categroy from './components/Category';
import PlaceCard from './components/PlaceCard';
import TempMarkerImageLoader from './components/MarkerSet';
import SearchBar from './components/SearchBar';
import Search from '../../common/icons/search.svg';
import { MY_ACCOUNT_PATH, SIGN_IN_PATH } from '../../common/constants/path.const';
import Human from '../../common/icons/human.svg';
import AlertConfirm from '../../common/dialog/AlertConfirm';
import LinkCopy from './components/LinkCopy';
import CertToggle from './components/CertToggle';
import CertCard from './components/CertCard';
import BallLoading from '../../common/utils/BallLoading';
import Marker from '../../common/icons/cert-map-marker.svg';
import UserLocation from './components/UserLocation';
import MapPageViewModel from './index.viewmodel';

interface MakerItem {
  id: number;
  category: string;
  marker: kakao.maps.Marker;
}

function MapTest() {
  // const mapElement = useRef(null);
  const navigate = useNavigate();
  const idDefault = useSelector((state: RootState) => state.map.selectedId);
  const toggleDefault = useSelector((state: RootState) => state.map.certToggle);
  const [isCertVisible, setIsCertVisible] = useState(toggleDefault);
  // const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isFirst, setIsFirst] = useState({ mungple: true, cert: true });
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const initMapCenter = useSelector((state: RootState) => state.map);
  // const [globarMap, setGlobarMap] = useState<kakao.maps.Map>();
  // const [selectedId, setSelectedId] = useState(idDefault);
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
  const [copyLoading, setCopyLoading] = useState(false);
  // const [currentMarker, setCurrentMarker] = useState<kakao.maps.Marker>();
  const [isSelected, setIsSelected] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState('');
  // const [pointerLocation, setPointerLocation] = useState({ lat: 0, lng: 0 });
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
  // const clearId = clearSelectedId(setSelectedId, selectedId);

  const {
    state: {
      map: globarMap,
      mapElement,
      mapDataList,
      selectedCategory,
      dogFootMarkerLocation: pointerLocation,
      selectedCert: tempa,
      dogFootMarker: currentMarker,
      selectedMungple,
      isSearchViewOpen,
      isAlertOpen,
    },
    action: {
      setSelectedMungple,
      openSearchView,
      closeSearchView,
      searchAndMoveToMungple,
      setIsAlertOpen,
      setSelectedCategory,
      navigateToMyaccountPage,
      navigateToLoginPage,
      certToggleClickHandler,
      setCurrentMapLocation,
    },
  } = MapPageViewModel();

  const showMungpleList = () => {
    markerList.forEach((marker) => {
      if (selectedCategory === '' || marker.category === selectedCategory)
        marker.marker.setVisible(true);
      else marker.marker.setVisible(false);
    });
  };

  useEffect(() => {
    if (globarMap && mapDataList) {
      showMungpleList();
    }
  }, [selectedCategory]);

  const moveKakaoMapCurrentLocation = (lat: number, lng: number) => {
    globarMap?.panTo(new kakao.maps.LatLng(lat, lng));
    setTimeout(() => globarMap?.setLevel(5), 200);
  };

  return (
    <div className="map-wrapper">
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={navigateToLoginPage}
          noButtonHandler={() => setIsAlertOpen(false)}
        />
      )}
      <div className="whiteBox" />
      <img
        className="map-logo"
        aria-hidden
        src={Logo}
        alt="logo"
        // onClick={clearId}
      />
      <img
        className="map-search"
        src={Search}
        alt="search"
        aria-hidden="true"
        onClick={openSearchView}
      />
      <img
        className="map-mypage"
        src={Human}
        alt="mypage"
        aria-hidden="true"
        onClick={navigateToMyaccountPage}
      />
      <div className="slogun">강아지 델고 동네생활</div>
      {!isCertVisible && (
        <Categroy
          selectedCategory={selectedCategory}
          onClick={(category) => setSelectedCategory(category)}
        />
      )}
      <div className="map" ref={mapElement} />
      {isSearchViewOpen && (
        <SearchBar
          selectId={searchAndMoveToMungple}
          cafeList={mapDataList!.mungpleList}
          close={closeSearchView}
        />
      )}
      {selectedMungple.title.length > 0 && (
        <PlaceCard
          id={selectedMungple.id}
          img={selectedMungple.img}
          title={selectedMungple.title}
          address={selectedMungple.address}
          categoryCode={selectedMungple.categoryCode}
          detailUrl={selectedMungple.detailUrl}
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
          setCenter={setCurrentMapLocation}
        />
      )}
      {!isSelected && !(selectedMungple.title.length > 0 || selectedCert.userId > 0) && (
        <UserLocation move={moveKakaoMapCurrentLocation} />
      )}
      {!isSelected && selectedMungple.title.length === 0 && selectedCert.userId === 0 && (
        <FooterNavigation setCenter={setCurrentMapLocation} />
      )}
      {!isSelected && !(selectedMungple.title.length > 0 || selectedCert.userId > 0) && (
        <CertToggle onClick={certToggleClickHandler} state={isCertVisible} />
      )}
      {selectedMungple.title.length > 0 && (
        <LinkCopy isMungple setLoading={setCopyLoading} redirect={setIsAlertOpen} />
      )}
      {isSelected && selectedMungple.title.length === 0 && (
        <LinkCopy
          isMungple={false}
          setLoading={setCopyLoading}
          redirect={setIsAlertOpen}
        />
      )}
      {copyLoading && <BallLoading />}
      <TempMarkerImageLoader />
    </div>
  );
}

export default MapTest;
