import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useSelector, useDispatch } from 'react-redux';
import Sheet from 'react-modal-sheet';
import { UPLOAD_PATH } from '../../../common/constants/path.const';
import { registerGalleryCertificationPost } from '../../../common/api/certification';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import ToastPurpleMessage from '../../../common/dialog/ToastPurpleMessage';
import { analytics } from '../../../index';
import useActive from '../../../common/hooks/useActive';
import DogLoading from '../../../common/utils/BallLoading';
import { compressFormData, blobFormData } from '../../../common/utils/FormData';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';
import FootPrintSmall from '../../../common/icons/foot-print-small.svg';

interface Props {
  postCertificationIsLoading: boolean;
  onPostCertificationLoading: () => void;
  offPostCertificationLoading: () => void;
}

function UploadCertificationRecord({
  postCertificationIsLoading,
  onPostCertificationLoading,
  offPostCertificationLoading,
}: Props) {
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  const initialHeight = useRef(window.innerHeight);
  const [certificateErrorToastMessage, setCertificateErrorToastMessage] = useState('');
  const [errorToastIsOpen, openCertificateErrorToast, closeCertificateErrorToast] =
    useActive(false);

  const {
    latitude,
    longitude,
    mongPlaceId,
    title,
    file,
    address,
    content,
    isHideAddress,
    categoryCode,
  } = useSelector((state: RootState) => state.persist.upload);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const certCompleteEvent = useAnalyticsCustomLogEvent(analytics, 'cert_end');
  const prevPath = location?.state?.prevPath;
  let icon = FootPrintSmall;

  if (categoryCode === 'CA0001') icon = WalkSmall;
  else if (categoryCode === 'CA0002') icon = CafeSmall;
  else if (categoryCode === 'CA0003') icon = EatSmall;
  else if (categoryCode === 'CA0004') icon = BathSmall;
  else if (categoryCode === 'CA0005') icon = BeautySmall;
  else if (categoryCode === 'CA0006') icon = HospitalSmall;
  else if (categoryCode === 'CA0007') icon = KinderSmall;

  const sheetStyle = {
    borderRadius: '18px 18px 0px 0px',
    height: initialHeight.current - window.innerWidth - 10,
  };

  useEffect(() => {
    if (errorToastIsOpen) {
      setTimeout(() => {
        closeCertificateErrorToast();
      }, 2000);
    }
  }, [errorToastIsOpen]);

  const registerMutation = useMutation(
    (formData: FormData) => registerGalleryCertificationPost(formData),
    {
      onMutate: () => {
        onPostCertificationLoading();
      },
      onSuccess: (response: AxiosResponse) => {
        const { code } = response.data;

        if (code === 200) {
          moveToCaptureResultPage();
        } else if (code === 314) {
          offPostCertificationLoading();
          setCertificateErrorToastMessage('카테고리당 하루 5번까지 인증 가능합니다');
          openCertificateErrorToast();
        } else if (code === 313) {
          offPostCertificationLoading();
          setCertificateErrorToastMessage('6시간 이내 같은 장소에서 인증 불가능합니다');
          openCertificateErrorToast();
        }
      },
      onError: (error: any) => {
        console.error(error);
      },
    },
  );

  const uploadGalleryImgCertification = async () => {
    if (postCertificationIsLoading) {
      return;
    }
    if (file === '') {
      setCertificateErrorToastMessage('이미지를 업로드해 주세요');
      openCertificateErrorToast();
      return;
    }
    if (address === '') {
      setCertificateErrorToastMessage('장소를 입력해 주세요');
      openCertificateErrorToast();
      return;
    }
    if (content.length < 15) {
      setCertificateErrorToastMessage('최소 15자 이상 입력해 주세요');
      openCertificateErrorToast();
      return;
    }

    const data = {
      userId: user.id,
      categoryCode: 'CA9999',
      mungpleId: mongPlaceId,
      placeName: title,
      description: content,
      latitude,
      longitude,
      isHideAddress,
    };

    const formData = blobFormData(data, file);
    const compressedFormData = await compressFormData(formData);

    registerMutation.mutate(compressedFormData);
  };

  const moveToCaptureResultPage = useCallback(() => {
    navigate(UPLOAD_PATH.RESULT, {
      state: {
        prevPath: location?.pathname,
      },
    });
  }, []);

  const screenUp = useCallback(() => {
    window.webkit.messageHandlers.NAME.postMessage('screenUp');
  }, []);

  const renderContentByOS = () => {
    switch (OS) {
      case 'ios':
        return (
          <main
            className="capture-img-record ios-capture-record"
            style={{
              height: initialHeight.current - window.innerWidth - 10,
            }}
          >
            <body className="review-container">
              <div className="review-place-info">
                <div className="review-place-info-title-wrapper">
                  <img src={icon} alt="category-img" />
                  <div className="review-place-info-title">
                    {address !== '' ? address : '기록 남길 주소'}
                  </div>
                </div>
                <input
                  className="review-place-info-search-input"
                  placeholder="여기는 어디인가요? ex. 델고카페, 동네 산책로"
                  onChange={
                    prevPath === 'homeMap'
                      ? (e) => dispatch(uploadAction.setTitle({ title: e.target.value }))
                      : undefined
                  }
                  onFocus={
                    prevPath === undefined
                      ? () => navigate(UPLOAD_PATH.LOCATION)
                      : undefined
                  }
                  disabled={prevPath === 'homeMungple' && true}
                  value={title !== '' ? title : undefined}
                />
              </div>

              {mongPlaceId === 0 && (
                <div className="review-place-address-hide">
                  <div style={{ display: 'flex' }}>
                    <input
                      className="review-place-address-hide-button"
                      type="checkbox"
                      checked={isHideAddress}
                      onClick={() =>
                        dispatch(
                          uploadAction.setHideAddress({
                            isHideAddress: !isHideAddress,
                          }),
                        )
                      }
                    />
                    <div
                      className="review-place-address-hide-label"
                      aria-hidden
                      onClick={() =>
                        dispatch(
                          uploadAction.setHideAddress({
                            isHideAddress: !isHideAddress,
                          }),
                        )
                      }
                    >
                      주소 나만보기
                    </div>
                  </div>
                  {isHideAddress && (
                    <div style={{ position: 'relative' }}>
                      <div className="review-place-address-hide-box">
                        다른 사용자에게는 장소이름만 보여요
                      </div>
                      <div className="review-place-address-hide-arrow" />
                    </div>
                  )}
                </div>
              )}
              <div className="review-guidance-text">
                이곳에 대해 남기고 싶은 기록이 있나요?
              </div>

              <textarea
                className="review-content"
                placeholder="🐶 강아지 친구들이 참고할 내용을 적어주면 좋아요"
                onChange={(e) =>
                  dispatch(
                    uploadAction.setContent({
                      content: e.target.value,
                    }),
                  )
                }
                maxLength={199}
                onFocus={screenUp}
              >
                {content}
              </textarea>
              <div className="review-content-length">{content.length}/200</div>
            </body>
            <footer>
              {content.length > 0 ? (
                <div
                  className="writting-button-active"
                  aria-hidden="true"
                  onClick={uploadGalleryImgCertification}
                >
                  기록완료
                </div>
              ) : (
                <div className="writting-button">기록완료</div>
              )}
            </footer>
          </main>
        );
      case 'android':
        return (
          <Sheet
            isOpen={bottomSheetIsOpen}
            onClose={closeBottomSheet}
            snapPoints={[
              initialHeight.current - window.innerWidth - 10,
              initialHeight.current - window.innerWidth - 10,
              initialHeight.current - window.innerWidth - 10,
              initialHeight.current - window.innerWidth - 10,
            ]}
            disableDrag
          >
            <Sheet.Container style={sheetStyle}>
              <Sheet.Content>
                <main
                  className="capture-img-record ios-capture-record"
                  style={{
                    height: initialHeight.current - window.innerWidth - 10,
                  }}
                >
                  <body className="review-container">
                    <div className="review-place-info">
                      <div className="review-place-info-title-wrapper">
                        <img src={icon} alt="category-img" />
                        <div className="review-place-info-title">
                          {address !== '' ? address : '기록 남길 주소'}
                        </div>
                      </div>
                      <input
                        className="review-place-info-search-input"
                        placeholder="여기는 어디인가요? ex. 델고카페, 동네 산책로"
                        onChange={
                          prevPath === 'homeMap'
                            ? (e) =>
                                dispatch(uploadAction.setTitle({ title: e.target.value }))
                            : undefined
                        }
                        onFocus={
                          prevPath === undefined
                            ? () => navigate(UPLOAD_PATH.LOCATION)
                            : undefined
                        }
                        disabled={prevPath === 'homeMungple' && true}
                        value={title !== '' ? title : undefined}
                      />
                    </div>
                    {mongPlaceId === 0 && (
                      <div className="review-place-address-hide">
                        <div style={{ display: 'flex' }}>
                          <input
                            className="review-place-address-hide-button"
                            type="checkbox"
                            checked={isHideAddress}
                            onClick={() =>
                              dispatch(
                                uploadAction.setHideAddress({
                                  isHideAddress: !isHideAddress,
                                }),
                              )
                            }
                          />
                          <div
                            className="review-place-address-hide-label"
                            aria-hidden="true"
                            onClick={() =>
                              dispatch(
                                uploadAction.setHideAddress({
                                  isHideAddress: !isHideAddress,
                                }),
                              )
                            }
                          >
                            주소 나만보기
                          </div>
                        </div>
                        {isHideAddress && (
                          <div style={{ position: 'relative' }}>
                            <div className="review-place-address-hide-box">
                              다른 사용자에게는 장소이름만 보여요
                            </div>
                            <div className="review-place-address-hide-arrow" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="review-guidance-text">
                      이곳에 대해 남기고 싶은 기록이 있나요?
                    </div>

                    <textarea
                      className="review-content"
                      placeholder="🐶 강아지 친구들이 참고할 내용을 적어주면 좋아요"
                      onChange={(e) =>
                        dispatch(
                          uploadAction.setContent({
                            content: e.target.value,
                          }),
                        )
                      }
                      maxLength={199}
                    >
                      {content}
                    </textarea>
                    <div className="review-content-length">{content.length}/200</div>
                  </body>
                  <footer>
                    {content.length > 0 ? (
                      <div
                        className="writting-button-active"
                        aria-hidden="true"
                        onClick={uploadGalleryImgCertification}
                      >
                        기록완료
                      </div>
                    ) : (
                      <div className="writting-button">기록완료</div>
                    )}
                  </footer>
                </main>
              </Sheet.Content>
            </Sheet.Container>
          </Sheet>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {postCertificationIsLoading && <DogLoading />}
      {renderContentByOS()}
      {errorToastIsOpen && <ToastPurpleMessage message={certificateErrorToastMessage} />}
    </>
  );
}

export default UploadCertificationRecord;
