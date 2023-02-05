import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAnalyticsLogEvent, useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import { AxiosResponse } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Map.scss";
import { getMapData } from "../../../common/api/record";
import { Mungple, idDefault } from "./maptype";
import Cafe from "../../../common/icons/cafe-map.svg";
import CafeSmall from "../../../common/icons/cafe-map-small.svg";
import PlaceCard from "./PlaceCard";
import { analytics } from "../../../index";
import { setMarkerOptionBig, setMarkerOptionSmall, setMarkerOptionPrev } from "./MapComponent";
import SearchBar from "./SearchBar";
import LinkCopy from "./LinkCopy";
import Search from "../../../common/icons/search.svg";
import Logo from "../../../common/icons/logo.svg";
import ToastMessage from "./ToastMessage";
import Regist from "./Regist";
import { mapAction } from "../../../redux/slice/mapSlice";
import Feedback from "./Feedback";
import DetailPage from "../../../page/DetailPage";
import FooterNavigation from "../../../components/FooterNavigation";
import CertToggle from "./CertToggle";
import Human from "../../../common/icons/human.svg";
import { MY_ACCOUNT_PATH, SIGN_IN_PATH } from "../../../common/constants/path.const";
import { RootState } from "../../../redux/store";

interface MakerItem {
  id: number;
  marker: naver.maps.Marker;
}

function Map() {
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSignIn = useSelector((state:RootState) => state.persist.user.isSignIn);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [globarMap, setGlobarMap] = useState<naver.maps.Map>();
  const [selectedId, setSelectedId] = useState(idDefault);
  const [mungpleList, setMungpleList] = useState<Mungple[]>([]);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
  const [detailUrl, setDetailUrl] = useState("");
  const [linkId, setLinkId] = useState(NaN);
  const [isCertVisible, setIsCertVisible] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [registOpen, setIsRegistOpen] = useState(false);
  const viewCount = useSelector((state: any) => state.persist.viewCount);
  const initMapCenter = useSelector((state: any) => state.map);
  const isCopy = useSelector((state: any) => state.map.isCopy);
  const [currentLocation, setCurrentLocation] = useState({
    lat: !initMapCenter.y ? 37.5057018 : initMapCenter.y,
    lng: !initMapCenter.x ? 127.1141119 : initMapCenter.x,
    zoom: !initMapCenter.zoom ? 14 : initMapCenter.zoom,
    option: { zoom: 2, size: 70 },
  });
  const mutation = useAnalyticsLogEvent(analytics, "screen_view");
  const mungpleClickEvent = useAnalyticsCustomLogEvent(analytics, "map_mungple");
  let map: naver.maps.Map;
  const routerLocation = useLocation();

  const clearSelectedId = useCallback(() => {
    setSelectedId((prev: any) => {
      return {
        img: "",
        title: "",
        address: "",
        id: 0,
        prevId: prev.id,
        lat: 0,
        detailUrl: "",
        instaUrl: "",
        lng: 0,
        categoryCode: "0",
        prevLat: prev.lat,
        prevLng: prev.lng,
        prevCategoryCode: prev.categoryCode,
      };
    });
  }, [selectedId]);

  const getMapPageData = useCallback(() => {
    getMapData((response: AxiosResponse) => {
      console.log(response);
      const { data } = response.data;
      setMungpleList(data);
    }, dispatch);
  }, []);

  useEffect(() => {
    // document.getElementsByClassName('map-wrapper') = "hidden";
    document.body.style.overflow = "hidden";
    mutation.mutate({
      params: {
        firebase_screen: "Map",
        firebase_screen_class: "MapPage",
      },
    });
    getMapPageData();
    if (!mapElement.current || !naver) return;
    const location = new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng);
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: currentLocation.zoom,
      zoomControl: false,
    };

    map = new naver.maps.Map(mapElement.current, mapOptions);

    setGlobarMap(map);
    naver.maps.Event.addListener(map, "click", (e) => {
      clearSelectedId();
    });
    setLinkId(parseInt(routerLocation.pathname.slice(1),10));
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, []);

  useEffect(() => {
    if (viewCount === 2) {
      setIsRegistOpen(true);
    }
  }, [viewCount]);

  const feedbackOpenHandler = useCallback(() => {
    setFeedbackOpen(true);
  }, []);

  const feedbackCloseHandler = useCallback(() => {
    setFeedbackOpen(false);
  }, []);

  const reigstCloseHandler = useCallback(() => {
    dispatch(mapAction.setViewCount());
    localStorage.setItem("isRegisted", "true");
    setIsRegistOpen(false);
  }, []);

  useEffect(() => {
    const tempList = mungpleList.map((data) => {
      let markerOptions: naver.maps.MarkerOptions;
      markerOptions = setMarkerOptionSmall(CafeSmall, data, globarMap);
      const marker = new naver.maps.Marker(markerOptions);
      marker.addListener("click", () => {
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
        markerOptions = setMarkerOptionBig(Cafe, data, globarMap, selectedId.prevCategoryCode);
        marker.setOptions(markerOptions);
      });
      return { marker, id: data.mungpleId };
    });
    setMarkerList(tempList);
  }, [mungpleList]);

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
    const markerOptions = setMarkerOptionBig(Cafe, data, globarMap, selectedId.prevCategoryCode);
    const index = markerList.findIndex((marker) => {
      return marker.id === data.mungpleId;
    });
    markerList[index].marker.setOptions(markerOptions);
    globarMap?.panTo(new naver.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude)), {
      duration: 500,
      easing: "easeOutCubic",
    });
  };

  useEffect(() => {
    if (selectedId.prevId === selectedId.id) return;
    if (selectedId.prevId > 0) {
      const index = markerList.findIndex((e) => {
        return e.id === selectedId.prevId;
      });
      // let markerOptions: naver.maps.MarkerOptions;
      const markerOptions = setMarkerOptionPrev(CafeSmall, selectedId, globarMap);
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
            parseFloat(mungpleList[index].longitude)
          ),
          {
            duration: 500,
            easing: "easeOutCubic",
          }
        );
        const markerOptions = setMarkerOptionBig(
          Cafe,
          mungpleList[index],
          globarMap,
          selectedId.prevCategoryCode
        );
        markerList[index].marker.setOptions(markerOptions);
      }
      setLinkId(NaN);
    }
  }, [markerList]);

  const searchClickHander = () => {
    setSearchIsOpen(true);
  };

  const searchClose = () => {
    setSearchIsOpen(false);
  };

  const setDetailPage = (url: string) => {
    setDetailUrl(url);
  };

  const closeDetailUrl = () => {
    setDetailUrl("");
  };

  const onClickCertToggle = () => {
    setIsCertVisible((prev) => !prev);
    console.log(isCertVisible);
  };

  const navigateMyPage = () => {
    if(isSignIn) navigate(MY_ACCOUNT_PATH.MAIN);
    else navigate(SIGN_IN_PATH.MAIN);
  };

  return (
    <div className="map-wrapper">
      <div className="whiteBox" />
      <img className="map-logo" src={Logo} alt="logo" />
      <img className="map-search" src={Search} alt="search" aria-hidden="true" onClick={searchClickHander} />
      <img className="map-mypage" src={Human} alt="mypage" aria-hidden="true" onClick={navigateMyPage} />
      <div className="slogun">강아지 델고 동네생활</div>
      <div className="map" ref={mapElement} style={{ position: "absolute" }}/>
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
      <CertToggle onClick={onClickCertToggle} state={isCertVisible} />
      {isCopy && <ToastMessage message="URL이 복사되었습니다." />}
      {selectedId.title.length > 0 && <LinkCopy />}
      {registOpen && <Regist feedbackOpen={feedbackOpenHandler} close={reigstCloseHandler} />}
      {/* <Regist feedbackOpen={feedbackOpenHandler} close={reigstCloseHandler} /> */}
      {feedbackOpen && <Feedback close={feedbackCloseHandler} />}
      {/* <Feedback close={feedbackCloseHandler}/> */}
      {detailUrl.length > 0 && <DetailPage />}
      {selectedId.title.length === 0 && <FooterNavigation />}
    </div>
  );
}

export default Map;
