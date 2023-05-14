import React, { useState, useEffect, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useSelector, useDispatch } from 'react-redux';
import Sheet from 'react-modal-sheet';
import { CAMERA_PATH } from '../../../common/constants/path.const';
import { registerGalleryCertificationPost } from '../../../common/api/certification';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import ToastPurpleMessage from '../../../common/dialog/ToastPurpleMessage';
import { analytics } from '../../../index';
import useActive from '../../../common/hooks/useActive';
import useInput from '../../../common/hooks/useInput';
import DogLoading from '../../../common/utils/BallLoading';
import { compressFormData } from '../../../common/utils/compressFormData';

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
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  const [certificationPostContent, onChangeCertificationPostContent] = useInput('');
  const [certificateErrorToastMessage, setCertificateErrorToastMessage] = useState('');
  const [
    certificateErrorToastIsOpen,
    openCertificateErrorToast,
    closeCertificateErrorToast,
  ] = useActive(false);
  const { latitude, longitude, mongPlaceId, title, file, address } = useSelector(
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

  const registerMutation = useMutation(
    (formData: FormData) => registerGalleryCertificationPost(formData),
    {
      onMutate: () => {
        onPostCertificationLoading();
      },
      onSuccess: (response: AxiosResponse) => {
        const { code, data } = response.data;
        console.log('response',response)
        if (code === 200) {
          console.log('file', file);
          dispatch(
            uploadAction.setContentRegistDtCertificationIdAddress({
              content: certificationPostContent,
              registDt: data.registDt,
              certificationId: data.certificationId,
              address: data.address,
              achievements: [],
            }),
          );
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

    const data = {
      userId: user.id,
      categoryCode: 'CA9999',
      mungpleId: mongPlaceId,
      placeName: title,
      description: certificationPostContent,
      latitude,
      longitude,
    };

    console.log('data',data)
    formData.append('photo', file);

    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });

    formData.append('data', blob);

    const compressedFormData = await compressFormData(formData);

    registerMutation.mutate(compressedFormData);
  };

  const moveToCaptureResultPage = useCallback(() => {
    navigate(CAMERA_PATH.RESULT, {
      state: {
        prevPath: location?.pathname,
      },
    });
  },[])

  const screenUp = useCallback(() => {
    window.webkit.messageHandlers.NAME.postMessage('screenUp');
  },[])

  console.log('address',address)

  return (
    <>
      {postCertificationIsLoading && <DogLoading />}
      {OS === 'ios' ? (
        <main
          className="capture-img-record ios-capture-record"
          style={{
            height: window.screen.height - window.screen.width + 10,
          }}
        >
          <body className="review-container">
            <div className="review-place-info">
              <div className="review-place-info-title">{title}</div>
              <div className="review-place-info-address">{address}</div>
            </div>
            <textarea
              className="review-content"
              placeholder="남기고 싶은 기록을 작성해주세요"
              onChange={onChangeCertificationPostContent}
              maxLength={199}
              onFocus={screenUp}
            >
              {certificationPostContent}
            </textarea>
            <div className="review-content-length">
              {certificationPostContent.length}/200
            </div>
          </body>
          <footer>
            {certificationPostContent.length > 0 ? (
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
                  <div className="review-place-info">
                    <div className="review-place-info-title">{title}</div>
                    <div className="review-place-info-address">{address}</div>
                  </div>
                  <textarea
                    className="review-content"
                    placeholder="남기고 싶은 기록을 작성해주세요"
                    onChange={onChangeCertificationPostContent}
                    maxLength={199}
                    onFocus={screenUp}
                    autoCapitalize="off"
                  >
                    {certificationPostContent}
                  </textarea>
                  <div className="review-content-length">
                    {certificationPostContent.length}/200
                  </div>
                </body>
                <footer>
                  {certificationPostContent.length > 0 ? (
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
      )}
      {certificateErrorToastIsOpen && (
        <ToastPurpleMessage message={certificateErrorToastMessage} />
      )}
    </>
  );
}

export default CaptureCertificationRecord;
