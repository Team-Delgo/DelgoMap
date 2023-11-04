import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import Sheet from 'react-modal-sheet';
import { UPLOAD_PATH } from '../../../common/constants/path.const';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { getMungPlaceList } from '../../../common/api/certification';
import {
  GET_MUNG_PLACE_LIST,
  CACHE_TIME,
  STALE_TIME,
} from '../../../common/constants/queryKey.const';
import RightArrow from '../../../common/icons/right-arrow-gray.svg';
import Check from '../../../common/icons/place-check.svg';
import { useErrorHandlers } from '../../../common/api/useErrorHandlers';
import { MungPlaceType } from '../../../common/types/mungPlace';
import useActive from '../../../common/hooks/useActive';
import { mapAction } from '../../../redux/slice/mapSlice';
import { RootState } from '../../../redux/store';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import EtcSmall from '../../../common/icons/etc-small.svg';
import { categoryType2 } from '../../../common/types/category';

const icons: categoryType2 = {
  CA0001: WalkSmall,
  CA0002: CafeSmall,
  CA0003: EatSmall,
  CA0004: BathSmall,
  CA0005: BeautySmall,
  CA0006: HospitalSmall,
  CA0007: KinderSmall,
  CA9999: EtcSmall,
};

interface KaKaoPlace {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

function UploadLocationRecord() {
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  // const [checkedPlaceId, setCheckedPlaceId] = useState(-1); //선택한 placeId (멍플장소만)
  const inputRef = useRef<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialHeight = useRef(window.innerHeight);
  const [placeName, setPlaceName] = useState('');
  const [kakaoPlaceList, setKaKaoPlaceList] = useState<Array<KaKaoPlace>>([]);

  const sheetStyle = {
    borderRadius: '18px 18px 0px 0px',
    height: initialHeight.current - window.innerWidth + 10,
  };

  const { data: mungPlaceList } = useQuery(
    GET_MUNG_PLACE_LIST,
    () => getMungPlaceList(),
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onSuccess(data) {
        console.log('data', data);
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  const selectMongPlace = (place: MungPlaceType) => (event: React.MouseEvent) => {
    const { mungpleId, placeName, address } = place;
    dispatch(uploadAction.setMongPlace({ mungpleId, placeName, address }));
    setTimeout(() => {
      navigate(UPLOAD_PATH.CERTIFICATION);
    }, 100);
  };

  const selectKaKaoPlace = (place: KaKaoPlace) => (event: React.MouseEvent) => {
    const { name, address, latitude, longitude } = place;
    dispatch(
      uploadAction.setManualPlace({
        placeName: name,
        address,
        latitude: latitude,
        longitude: longitude,
        mongPlaceId: 0,
      }),
    );
    setTimeout(() => {
      navigate(UPLOAD_PATH.CERTIFICATION); //다시 인증페이지 이동
    }, 100);
  };

  const navigateCertMap = () => {
    dispatch(mapAction.setCurrentPlaceName(inputRef.current.value));
    setTimeout(() => {
      navigate(UPLOAD_PATH.MAP);
    }, 100);
  };

  const searchPlacesByKeyword = (
    keyword: string,
    callback: (places: KaKaoPlace[]) => void,
  ): void => {
    const places = new kakao.maps.services.Places();

    const placesSearchCB = (data: any[], status: kakao.maps.services.Status) => {
      if (status === kakao.maps.services.Status.OK) {
        const placeList = data.map((place) => ({
          name: place.place_name,
          address: place.address_name,
          latitude: place.y,
          longitude: place.x,
        }));
        callback(placeList);
      } else {
        callback([]);
      }
    };

    places.keywordSearch(keyword, placesSearchCB);
  };

  const onChangePlaceName = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = e.target;
      setPlaceName(value);
      searchPlacesByKeyword(value, (places: KaKaoPlace[]) => {
        console.log('places', places);
        setKaKaoPlaceList(places);
      });
    },
    [],
  );

  const manualPlace = () => {
    return (
      <div
        className="review-manual-place-wrapper"
        aria-hidden="true"
        onClick={navigateCertMap}
      >
        <div className={'review-place-wrapper-active-name'}>{placeName}</div>
        <div className="review-place-wrapper-second">
          <div className="review-place-map-choice">지도에 직접추가</div>
          <img
            className="review-place-map-choice-img"
            alt="right-arrow-img"
            src={RightArrow}
            height={13}
            width={8}
          />
        </div>
      </div>
    );
  };

  const kakaoPlace = () => {
    return (
      <>
        <div style={{ height: '1px', backgroundColor: '#F6F6F6', margin: '16px 0' }} />
        <div>
          {kakaoPlaceList.map((place: KaKaoPlace,idx:number) => {
            if (placeName?.length > 0) {
              return (
                <div
                  style={{ paddingBottom: '20px' }}
                  aria-hidden="true"
                  onClick={selectKaKaoPlace(place)}
                  key={idx}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={'review-place-wrapper-active-name'}>
                        {highlightText(place.name, placeName)}
                      </div>
                    </div>
                    <div className={'review-place-wrapper-active-address'}>
                      {highlightText(place.address, placeName)}
                    </div>
                  </div>
                  {/* {checkedPlaceId === place.mungpleId ? (
                    <img className="review-place-check" src={Check} alt="category-img" />
                  ) : null} */}
                </div>
              );
            }
          })}
        </div>
      </>
    );
  };

  const highlightText = (text: string, keyword: string) => {
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span key={index} style={{ color: '#7A5CCF', fontWeight: 500 }}>
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return OS === 'ios' ? (
    <main
      className="capture-img-record ios-capture-record"
      style={{
        height: initialHeight.current - window.innerWidth + 10,
      }}
    >
      <body className="review-container">
        <input
          type="text"
          ref={inputRef}
          className="review-place-name"
          placeholder="여기는 어디인가요? (ex.델고카페, 동네 산책로)"
          onChange={onChangePlaceName}
        />
        {placeName.length > 0 && manualPlace()}
        {mungPlaceList?.data.map((place: MungPlaceType) => {
          if (placeName.length > 0) {
            if (
              place.placeName.includes(placeName) ||
              place.address.includes(placeName)
            ) {
              return (
                <div
                  className="review-place-wrapper"
                  aria-hidden="true"
                  onClick={selectMongPlace(place)}
                  key={place.mungpleId}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={'review-place-wrapper-active-name'}>
                        {highlightText(place.placeName, placeName)}
                      </div>
                      <div style={{ display: 'flex', height: '100%' }}>
                        <img
                          src={icons[place.categoryCode]}
                          width={14}
                          height={14}
                          style={{ marginLeft: '5px' }}
                        />
                      </div>
                    </div>
                    <div className={'review-place-wrapper-active-address'}>
                      {highlightText(place.address, placeName)}
                    </div>
                  </div>
                  {/* {checkedPlaceId === place.mungpleId ? (
                    <img className="review-place-check" src={Check} alt="category-img" />
                  ) : null} */}
                </div>
              );
            }
          }
        })}
        {kakaoPlaceList.length > 0 && kakaoPlace()}
      </body>
    </main>
  ) : (
    <Sheet
      isOpen={bottomSheetIsOpen}
      onClose={closeBottomSheet}
      snapPoints={[
        initialHeight.current - window.innerWidth + 10,
        initialHeight.current - window.innerWidth + 10,
        initialHeight.current - window.innerWidth + 10,
        initialHeight.current - window.innerWidth + 10,
      ]}
      disableDrag
      className="modal-bottom-sheet"
    >
      <Sheet.Container style={sheetStyle}>
        <Sheet.Content>
          <main
            className="capture-img-record"
            style={{
              height: initialHeight.current - window.innerWidth - 10,
            }}
          >
            <body className="review-container">
              <input
                type="text"
                ref={inputRef}
                className="review-place-name"
                placeholder="여기는 어디인가요? (ex.델고카페, 동네 산책로)"
                onChange={onChangePlaceName}
              />
              {placeName.length > 0 && manualPlace()}
              {mungPlaceList?.data.map((place: MungPlaceType) => {
                if (placeName.length > 0) {
                  if (place.placeName.includes(placeName)) {
                    return (
                      <div
                        className="review-place-wrapper"
                        aria-hidden="true"
                        onClick={selectMongPlace(place)}
                        key={place.mungpleId}
                      >
                        <div>
                          <div style={{ display: 'flex' }}>
                            <div className={'review-place-wrapper-active-name'}>
                              {highlightText(place.placeName, placeName)}
                            </div>
                            <img
                              src={icons[place.categoryCode]}
                              width={14}
                              height={14}
                              style={{ marginLeft: '5px' }}
                            />
                          </div>
                          <div className={'review-place-wrapper-active-address'}>
                            {highlightText(place.address, placeName)}
                          </div>
                        </div>
                        {/* {checkedPlaceId === place.mungpleId ? (
                          <img
                            className="review-place-check"
                            src={Check}
                            alt="category-img"
                          />
                        ) : null} */}
                      </div>
                    );
                  }
                }
              })}
              {kakaoPlaceList.length > 0 && kakaoPlace()}
            </body>
          </main>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

export default UploadLocationRecord;
