import React, { useState } from 'react';
import './index.scss';
import FooterNavigation from '../../components/FooterNavigation';
import Logo from '../../common/icons/logo.svg';
import Categroy from './components/Category';
import PlaceCard from './components/PlaceCard';
import TempMarkerImageLoader from './components/MarkerSet';
import SearchBar from './components/Search';
import Search from '../../common/icons/search.svg';
import Human from '../../common/icons/human.svg';
import AlertConfirm from '../../common/dialog/AlertConfirm';
import LinkCopy from './components/CertToastMessage';
import CertToggle from './components/CertToggle';
import CertCard from './components/CertCard';
import BallLoading from '../../common/utils/BallLoading';
import UserLocation from './components/UserLocation';
import useMap from './index.hook';

function Map() {
  const [copyLoading, setCopyLoading] = useState(false);

  const {
    state: {
      map: globarMap,
      mapElement,
      mapDataList,
      selectedCategory,
      selectedCert,
      selectedMungple,
      isSearchViewOpen,
      isAlertOpen,
      isSelectedAnything,
      isCertToggleOn,
    },
    action: {
      openSearchView,
      closeSearchView,
      searchAndMoveToMungple,
      setIsAlertOpen,
      setSelectedCategory,
      navigateToMyaccountPage,
      navigateToLoginPage,
      certToggleClickHandler,
      setCurrentMapLocation,
      searchAndMoveToKakaoPlace
    },
  } = useMap();

  const moveKakaoMapCurrentLocation = (lat: number, lng: number) => {
    globarMap?.panTo(new kakao.maps.LatLng(lat, lng));
    setTimeout(() => globarMap?.setLevel(5), 200);
  };

  console.log(selectedCert);

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
      <img className="map-logo" aria-hidden src={Logo} alt="logo" />
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
      {!isCertToggleOn && (
        <Categroy
          selectedCategory={selectedCategory}
          onClick={(category) => {
            setSelectedCategory(category);
          }}
        />
      )}
      <div className="map" ref={mapElement} />
      {isSearchViewOpen && (
        <SearchBar
          selectKakaoPlace={searchAndMoveToKakaoPlace}
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
      {!isSelectedAnything &&
        !(selectedMungple.title.length > 0 || selectedCert.userId > 0) && (
          <UserLocation move={moveKakaoMapCurrentLocation} />
        )}
      {!isSelectedAnything &&
        selectedMungple.title.length === 0 &&
        selectedCert.userId === 0 && (
          <FooterNavigation setCenter={setCurrentMapLocation} />
        )}
      {!isSelectedAnything &&
        !(selectedMungple.title.length > 0 || selectedCert.userId > 0) && (
          <CertToggle onClick={certToggleClickHandler} state={isCertToggleOn} />
        )}
      {selectedMungple.title.length > 0 && <LinkCopy isMungple />}
      {isSelectedAnything && selectedMungple.title.length === 0 && (
        <LinkCopy isMungple={false} />
      )}
      {copyLoading && <BallLoading />}
      <TempMarkerImageLoader />
    </div>
  );
}

export default Map;
