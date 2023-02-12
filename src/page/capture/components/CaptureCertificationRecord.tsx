import React, { useState, useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useSelector, useDispatch } from 'react-redux';
import Sheet from 'react-modal-sheet';
import imageCompression from 'browser-image-compression';
import { CAMERA_PATH } from '../../../common/constants/path.const';
import {
  registerGalleryCertificationPost,
  registerGalleryCertificationImg,
} from '../../../common/api/certification'
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import WrittingButton from '../../../common/icons/writting-button.svg';
import WrittingButtonActive from '../../../common/icons/writting-button-active.svg';
import ToastPurpleMessage from '../../../common/dialog/ToastPurpleMessage';
import { analytics } from '../../../index';
import useActive from '../../../common/hooks/useActive';
import useInput from '../../../common/hooks/useInput';

interface CaptureCertificationRecordPropsType {
  postCertificationIsLoading: boolean;
  onPostCertificationLoading: () => void;
  offPostCertificationLoading: () => void;
}

const sheetStyle = { borderRadius: '18px 18px 0px 0px' };

function CaptureCertificationRecord({
  postCertificationIsLoading,
  onPostCertificationLoading,
  offPostCertificationLoading,
}: CaptureCertificationRecordPropsType) {
  const [certificationPostContent, onChangeCertificationPostContent] = useInput('');
  const [certificateErrorToastMessage, setCertificateErrorToastMessage] = useState('');
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  const [certificateErrorToastIsOpen, openCertificateErrorToast, closeCertificateErrorToast] = useActive(false);
  const { categoryKo, img, latitude, longitude, mongPlaceId, title, tool, file, address } = useSelector(
    (state: RootState) => state.persist.upload,
  );
  const { user } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = new FormData();
  const location = useLocation();
  const certCompleteEvent = useAnalyticsCustomLogEvent(analytics, 'cert_end');

  useEffect(() => {
    if (certificateErrorToastIsOpen) {
      setTimeout(() => {
        closeCertificateErrorToast();
      }, 2000);
    }
  }, [certificateErrorToastIsOpen]);

  // const uploadCameraImgCertification = () => {
  //   if (postCertificationIsLoading) {
  //     return;
  //   }
  //   onPostCertificationLoading();
  //   registerCameraCertificationPost(
  //     {
  //       userId: user.id,
  //       categoryCode: categoryCode[categoryKo],
  //       mungpleId: mongPlaceId,
  //       placeName: title,
  //       description: certificationPostContent,
  //       latitude: latitude.toString(),
  //       longitude: longitude.toString(),
  //       photo: img,
  //     },
  //     (response: AxiosResponse) => {
  //       const { code, data } = response.data;
  //       if (code === 200) {
  //         certCompleteEvent.mutate();
  //         dispatch(
  //           uploadAction.setContentRegistDtCertificationIdAddress({
  //             content: certificationPostContent,
  //             registDt: data.registDt,
  //             certificationId: data.certificationId,
  //             address: data.address,
  //             achievements: [],
  //           }),
  //         );
  //         if (data.isAchievements) {
  //           dispatch(
  //             uploadAction.setAchievements({
  //               achievements: data.achievements,
  //             }),
  //           );
  //         }
  //         offPostCertificationLoading();
  //         moveToCaptureResultPage();
  //       } else if (code === 314) {
  //         offPostCertificationLoading();
  //         setCertificateErrorToastMessage('카테고리당 하루 5번까지 인증 가능합니다');
  //         openCertificateErrorToast();
  //       } else if (code === 313) {
  //         offPostCertificationLoading();
  //         setCertificateErrorToastMessage('6시간 이내 같은 장소에서 인증 불가능합니다');
  //         openCertificateErrorToast();
  //       } else if (code === 312) {
  //         offPostCertificationLoading();
  //         setCertificateErrorToastMessage('인증 가능한 장소에 있지 않습니다');
  //         openCertificateErrorToast();
  //       } else if (code === 316) {
  //         offPostCertificationLoading();
  //         setCertificateErrorToastMessage('GPS가 켜져 있지 않거나 권한 설정이 되어있지 않습니다');
  //         openCertificateErrorToast();
  //       }
  //     },
  //     dispatch,
  //   );
  // };

  const uploadGalleryImgCertification = () => {
    if (postCertificationIsLoading) {
      return;
    }
    onPostCertificationLoading();
    registerGalleryCertificationPost(
      {
        userId: user.id,
        categoryCode: 'CA0001',
        mungpleId: mongPlaceId,
        placeName: title,
        description: certificationPostContent,
        address,
      },
      (response: AxiosResponse) => {
        const { code, data } = response.data;
        if (code === 200) {
          const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };

          formData.append('photo', file);

          registerGalleryCertificationImg(
            formData,
            data.certificationId,
            (response: AxiosResponse) => {
              const { code } = response.data;
              if (code === 200) {
                dispatch(
                  uploadAction.setContentRegistDtCertificationIdAddress({
                    content: certificationPostContent,
                    registDt: data.registDt,
                    certificationId: data.certificationId,
                    address: data.address,
                    achievements: [],
                  }),
                );
                if (data.isAchievements) {
                  dispatch(
                    uploadAction.setAchievements({
                      achievements: data.achievements,
                    }),
                  );
                }
                offPostCertificationLoading();
                moveToCaptureResultPage();
              }
            },
            dispatch,
          );
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
      dispatch,
    );
  };

  const handlingDataForm = (dataURI: any) => {
    const byteString = atob(dataURI.split(',')[1]);

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ia], {
      type: 'image/jpeg',
    });
    const file = new File([blob], 'image.jpg');

    const formData = new FormData();
    formData.append('photo', file);

    console.log(formData, formData);

    return formData;
  };

  const moveToCapturePage = () => {
    navigate(CAMERA_PATH.CAPTURE);
  };

  const moveToCaptureResultPage = () => {
    navigate(CAMERA_PATH.RESULT, {
      state: {
        prevPath: location?.pathname,
      },
    });
  };

  return (
    <>
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
            <main className="capture-img-record">
              <body className="review-container">
                <div className="review-place-info">
                  <div className="review-place-info-title">{title}</div>
                  <div className="review-place-info-address">{address}</div>
                </div>
                <textarea
                  className="review-content"
                  placeholder="남기고 싶은 기록을 작성해주세요"
                  onChange={onChangeCertificationPostContent}
                  maxLength={200}
                />
                <div className="review-content-length">{certificationPostContent.length}/1000</div>
              </body>
              <footer>
                {certificationPostContent.length > 0 ? (
                  <div className="writting-button-active" aria-hidden="true" onClick={uploadGalleryImgCertification}>
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
      {certificateErrorToastIsOpen && <ToastPurpleMessage message={certificateErrorToastMessage} />}
    </>
  );
}

export default CaptureCertificationRecord;
