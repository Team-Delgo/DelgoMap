import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import './index.scss';
import FooterNavigation from '../../components/FooterNavigation';
import Logo from '../../common/icons/logo.svg';
import Categroy from './components/Category';
import PlaceCard from './components/PlaceCard';
import TempMarkerImageLoader from './components/MarkerSet';
import SearchBar from './components/Search';
import Search from '../../common/icons/search.svg';
import Human from '../../common/icons/human.svg';
import Alarm from '../../common/icons/alarm.svg';
import AlarmActive from '../../common/icons/alarm-active.svg';
import AlertConfirm from '../../common/dialog/AlertConfirm';
import LinkCopy from './components/CertToastMessage';
import CertToggle from './components/CertToggle';
import CertCard from './components/CertCard';
import BallLoading from '../../common/utils/BallLoading';
import UserLocation from './components/UserLocation';
import CountBox from './components/CountBox';
import ListBox from './components/ListView/ListBox';
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
      viewCount,
      selectedMungple,
      isSearchViewOpen,
      isAlertOpen,
      isSelectedAnything,
      isCertToggleOn,
      userId,
      isNewAlarm
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
      setCurrentUserLocation,
      setCurrentMapLocation,
      searchAndMoveToKakaoPlace,
      navigateToMyAlarmPage
    },
  } = useMap();
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
      <img className="map-logo" aria-hidden src={Logo} alt="logo" />
      <img
        className="map-search"
        src={Search}
        alt="search"
        aria-hidden="true"
        onClick={openSearchView}
      />
      <img
        className={
          userId === 0 ? 'map-alarm' : isNewAlarm ? 'map-alarm-active' : 'map-alarm'
        }
        src={userId === 0 ? Alarm : isNewAlarm ? AlarmActive : Alarm}
        alt="myalarm"
        aria-hidden="true"
        onClick={navigateToMyAlarmPage}
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
          listView={false}
        />
      )}
      <div className="map" ref={mapElement} />
      {isSearchViewOpen && (
        <SearchBar
          selectKakaoPlace={searchAndMoveToKakaoPlace}
          selectId={searchAndMoveToMungple}
          cafeList={mapDataList || []}
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
          img={selectedCert.photos[0]}
          title={selectedCert.placeName}
          categoryCode={selectedCert.categoryCode}
          registDt={selectedCert.registDt}
          description={selectedCert.description}
          setCenter={setCurrentMapLocation}
        />
      )}
      {!isSelectedAnything &&
        !(selectedMungple.title.length > 0 || selectedCert.userId > 0) && (
          <UserLocation
            move={moveKakaoMapCurrentLocation}
            setLocation={setCurrentUserLocation}
          />
        )}
      {!isSelectedAnything &&
        !isSearchViewOpen &&
        selectedMungple.title.length === 0 &&
        selectedCert.userId === 0 && <FooterNavigation page="map" />}

      {!isSelectedAnything &&
        !(selectedMungple.title.length > 0 || selectedCert.userId > 0) && (
          <CertToggle onClick={certToggleClickHandler} state={isCertToggleOn} />
        )}
      {isCertToggleOn && selectedCert.placeName.length === 0 && !isSelectedAnything && (
        <CountBox viewCount={viewCount} />
      )}
      {!isCertToggleOn && selectedCert.placeName.length === 0 && !isSelectedAnything && (
        <ListBox onClick={listboxHandler} />
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
