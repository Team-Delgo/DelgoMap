import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAnalyticsLogEvent, useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import { AxiosResponse } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Map.scss";
import { getMapData } from "../common/api/record";
import { Mungple, idDefault } from "./maptype";
import Cafe from "../common/icons/cafe-map.svg";
import CafeSmall from "../common/icons/cafe-map-small.svg";
import PlaceCard from "./PlaceCard";
import { analytics } from "../index";
import {
  setMarkerOptionBig,
  setMarkerOptionSmall,
  setMarkerOptionPrev,
  setCertOption,
} from "./MapComponent";
import SearchBar from "./SearchBar";
import LinkCopy from "./LinkCopy";

interface MakerItem {
  id: number;
  marker: naver.maps.Marker;
}

function Map() {
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [globarMap, setGlobarMap] = useState<naver.maps.Map>();
  const [selectedId, setSelectedId] = useState(idDefault);
  const [mungpleList, setMungpleList] = useState<Mungple[]>([]);
  const [markerList, setMarkerList] = useState<MakerItem[]>([]);
  const [linkId, setLinkId] = useState(NaN);
  const initMapCenter = useSelector((state: any) => state);
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
      const { data } = response.data;
      console.log(data);
      setMungpleList(data);
    }, dispatch);
  }, []);

  useEffect(() => {
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
    naver.maps.Event.addListener(map, "tap", (e) => {
      e.preventDefault();
      clearSelectedId();
    });
    setLinkId(parseInt(routerLocation.pathname.slice(1)));
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
    setSelectedId((prev: any) => {
      return {
        img: data.photoUrl,
        title: data.placeName,
        address: data.jibunAddress,
        id: data.mungpleId,
        prevId: prev.id,
        detailUrl: data.detailUrl,
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
      let markerOptions: naver.maps.MarkerOptions;
      markerOptions = setMarkerOptionPrev(CafeSmall, selectedId, globarMap);
      markerList[index].marker.setOptions(markerOptions);
    }
  }, [selectedId]);

  useEffect(() => {
    console.log(linkId);
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

  return (
    <div className="map-wrapper">
      <div
        className="cafe"
        aria-hidden="true"
        onClick={() => window.open("https://cafe.naver.com/delgo1234")}
      >
        카페이동
      </div>
      <div className="map" ref={mapElement} style={{ position: "absolute" }}></div>
      <SearchBar selectId={searchSelectId} cafeList={mungpleList} />
      {selectedId.title.length > 0 && (
        <PlaceCard
          img={selectedId.img}
          title={selectedId.title}
          address={selectedId.address}
          categoryCode={selectedId.categoryCode}
          detailUrl={selectedId.detailUrl}
        />
      )}
      {selectedId.title.length > 0 && <LinkCopy />}
    </div>
  );
}

export default Map;
