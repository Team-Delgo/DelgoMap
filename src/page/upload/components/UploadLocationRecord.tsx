import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import Sheet from 'react-modal-sheet';
import classnames from 'classnames';
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
import useInput from '../../../common/hooks/useInput';
import { mapAction } from '../../../redux/slice/mapSlice';
import { RootState } from '../../../redux/store';



function UploadLocationRecord() {
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  const [placeName, onChangePlaceName] = useInput('');
  const [checkedPlaceId, setCheckedPlaceId] = useState(-1);
  const [manualChecked, onCheckManual] = useActive(false);
  const inputRef = useRef<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialHeight = useRef(window.innerHeight);

  const sheetStyle = { borderRadius: '18px 18px 0px 0px',  height: initialHeight.current- window.innerWidth - 10   };

  const { data: mungPlaceList } = useQuery(
    GET_MUNG_PLACE_LIST,
    () => getMungPlaceList(),
    {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      onSuccess(data) {
        console.log('data',data)
      },
      onError: (error: any) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

  const selectMongPlace = useCallback(
    (place: MungPlaceType) => (event: React.MouseEvent) => {
      const { mungpleId, placeName, address } = place;
      setCheckedPlaceId(mungpleId);
      dispatch(
        uploadAction.setMongPlace({ mungpleId, placeName, address }),
      );
      setTimeout(() => {
        navigate(UPLOAD_PATH.CERTIFICATION);
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
    navigate(UPLOAD_PATH.MAP);
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
        height: initialHeight.current- window.innerWidth - 10 ,
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
                      {place.address}
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
      </body>
    </main>
  ) : (
    <Sheet
      isOpen={bottomSheetIsOpen}
      onClose={closeBottomSheet}
      snapPoints={[
        initialHeight.current- window.innerWidth - 10 ,
        initialHeight.current- window.innerWidth - 10 ,
        initialHeight.current- window.innerWidth - 10 ,
        initialHeight.current- window.innerWidth - 10 ,
      ]}
      disableDrag
      className="modal-bottom-sheet"
    >
      <Sheet.Container style={sheetStyle}>
        <Sheet.Content>
          <main
            className="capture-img-record"
            style={{
              height:         initialHeight.current- window.innerWidth - 10 ,
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
                            {place.address}
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

export default UploadLocationRecord;