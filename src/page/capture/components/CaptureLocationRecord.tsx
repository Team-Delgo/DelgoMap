/* eslint-disable array-callback-return */
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import Sheet from 'react-modal-sheet';
import classnames from 'classnames';
import { CAMERA_PATH } from '../../../common/constants/path.const';
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
import useInput from '../../../common/hooks/useInput';
import { mapAction } from '../../../redux/slice/mapSlice';
import { RootState } from '../../../redux/store';

const sheetStyle = { borderRadius: '18px 18px 0px 0px' };

function CaptureLocationRecord() {
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  const [placeName, onChangePlaceName] = useInput('');
  const [checkedPlaceId, setCheckedPlaceId] = useState(-1);
  const [manualChecked, onCheckManual] = useActive(false);
  const inputRef = useRef<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: mungPlaceList } = useQuery(
    GET_MUNG_PLACE_LIST,
    () => getMungPlaceList(),
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  const selectMongPlace = useCallback(
    (place: MungPlaceType) => (event: React.MouseEvent) => {
      const { mungpleId, placeName, jibunAddress } = place;
      setCheckedPlaceId(mungpleId);
      dispatch(
        uploadAction.setMongPlace({ mungpleId, placeName, address: jibunAddress }),
      );
      setTimeout(() => {
        navigate(CAMERA_PATH.CERTIFICATION);
      }, 1000);
    },
    [],
  );

  const selectManualPlace = useCallback(() => {
    onCheckManual();
    setTimeout(() => {
      navigateCertMap();
    }, 500);
  }, [placeName]);

  const navigateCertMap = () => {
    dispatch(mapAction.setCurrentPlaceName(inputRef.current.value));
    navigate(CAMERA_PATH.MAP);
  };

  const screenUp = () => {
    window.webkit.messageHandlers.NAME.postMessage('screenUp');
  };

  const manualPlace = () => {
    return (
      <div
        className="review-manual-place-wrapper"
        aria-hidden="true"
        onClick={selectManualPlace}
      >
        <div
          className={
            manualChecked === true
              ? 'review-place-wrapper-active-name'
              : 'review-place-wrapper-name'
          }
        >
          {placeName}
        </div>
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
  return OS === 'ios' ? (
    <main
      className="capture-img-record ios-capture-record"
      style={{
        height: window.screen.height - window.screen.width + 10,
      }}
    >
      <body className="review-container">
        <input
          type="text"
          ref={inputRef}
          className="review-place-name"
          placeholder="여기는 어디인가요?"
          onChange={onChangePlaceName}
          onFocus={screenUp}
        />
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
                    <div
                      className={
                        checkedPlaceId === place.mungpleId
                          ? 'review-place-wrapper-active-name'
                          : 'review-place-wrapper-name'
                      }
                    >
                      {place.placeName}
                    </div>
                    <div
                      className={
                        checkedPlaceId === place.mungpleId
                          ? 'review-place-wrapper-active-address'
                          : 'review-place-wrapper-address'
                      }
                    >
                      {place.roadAddress}
                    </div>
                  </div>
                  {checkedPlaceId === place.mungpleId ? (
                    <img className="review-place-check" src={Check} alt="category-img" />
                  ) : null}
                </div>
              );
            }
          }
        })}
        {placeName.length > 0 && manualPlace()}
      </body>
    </main>
  ) : (
    <Sheet
      isOpen={bottomSheetIsOpen}
      onClose={closeBottomSheet}
      snapPoints={[
        window.screen.height - window.screen.width + 10,
        window.screen.height - window.screen.width + 10,
        window.screen.height - window.screen.width + 10,
        window.screen.height - window.screen.width + 10,
      ]}
      // ref={ref}
      disableDrag
      className="modal-bottom-sheet"
    >
      <Sheet.Container style={sheetStyle}>
        <Sheet.Content>
          <main
            className="capture-img-record"
            style={{
              height: window.screen.height - window.screen.width + 10,
            }}
          >
            <body className="review-container">
              <input
                type="text"
                ref={inputRef}
                className="review-place-name"
                placeholder="여기는 어디인가요?"
                onChange={onChangePlaceName}
                onFocus={screenUp}
              />
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
                          <div
                            className={
                              checkedPlaceId === place.mungpleId
                                ? 'review-place-wrapper-active-name'
                                : 'review-place-wrapper-name'
                            }
                          >
                            {place.placeName}
                          </div>
                          <div
                            className={
                              checkedPlaceId === place.mungpleId
                                ? 'review-place-wrapper-active-address'
                                : 'review-place-wrapper-address'
                            }
                          >
                            {place.roadAddress}
                          </div>
                        </div>
                        {checkedPlaceId === place.mungpleId ? (
                          <img
                            className="review-place-check"
                            src={Check}
                            alt="category-img"
                          />
                        ) : null}
                      </div>
                    );
                  }
                }
              })}
              {placeName.length > 0 && manualPlace()}
            </body>
          </main>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

export default CaptureLocationRecord;
