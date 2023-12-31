import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { blobFormDataForMultipleFiles} from '../../../common/utils/FormData';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';
import FootPrintSmall from '../../../common/icons/foot-print-small.svg';
import CheckBox from '../../../common/icons/checkbox-purple.svg'

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
    imgList,
    fileList,
    cert,
  } = useSelector((state: RootState) => state.persist.upload);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const uploadBoxHeight = useMemo(() => window.innerHeight - window.innerWidth + 10, []);
  const certCompleteEvent = useAnalyticsCustomLogEvent(analytics, 'cert_end');
  let icon = FootPrintSmall;

  if (categoryCode === 'CA0001') icon = WalkSmall;
  else if (categoryCode === 'CA0002') icon = CafeSmall;
  else if (categoryCode === 'CA0003') icon = EatSmall;
  else if (categoryCode === 'CA0004') icon = BathSmall;
  else if (categoryCode === 'CA0005') icon = BeautySmall;
  else if (categoryCode === 'CA0006') icon = HospitalSmall;
  else if (categoryCode === 'CA0007') icon = KinderSmall;

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
        console.log('response',response)
        const { code } = response.data;

        if (code === 200) {
          dispatch(
            uploadAction.setCertificationId({
              certificationId: response.data.data.certificationId,
            }),
          );
          moveToUploadResultPage();
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
    if (imgList.length === 0) {
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

    const formData = blobFormDataForMultipleFiles(data, fileList);

    registerMutation.mutate(formData);
  };

  const moveToUploadResultPage = useCallback(() => {
    navigate(UPLOAD_PATH.RESULT, {
      state: {
        prevPath: location?.pathname,
      },
    });
  }, []);

  const renderContentByOS = () => {
    switch (OS) {
      case 'ios':
        return (
          <main
            className="capture-img-record ios-capture-record"
            style={{
              height: uploadBoxHeight,
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
                    cert === 'manual'
                      ? (e) => dispatch(uploadAction.setTitle({ title: e.target.value }))
                      : undefined
                  }
                  onClick={
                    cert === ''
                      ? () => {
                          const textareas =
                            document.getElementsByClassName('review-content');
                          for (let i = 0; i < textareas.length; i++) {
                            const textarea = textareas[i] as HTMLTextAreaElement;
                            textarea.blur();
                          }
                          setTimeout(() => {
                            navigate(UPLOAD_PATH.LOCATION);
                          }, 500);
                        }
                      : undefined
                  }
                  readOnly={cert !== 'manual'}
                  disabled={cert === 'mungple'}
                  value={title !== '' ? title : undefined}
                />
              </div>

              {mongPlaceId === 0 && (
                <div className="review-place-address-hide">
                  <div style={{ display: 'flex' }}>
                    {isHideAddress ? (
                      <img
                        src={CheckBox}
                        onClick={() =>
                          dispatch(
                            uploadAction.setHideAddress({
                              isHideAddress: !isHideAddress,
                            }),
                          )
                        }
                      />
                    ) : (
                      <input
                        className="review-place-address-hide-button"
                        type="checkbox"
                        onClick={() =>
                          dispatch(
                            uploadAction.setHideAddress({
                              isHideAddress: !isHideAddress,
                            }),
                          )
                        }
                      />
                    )}
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
                maxLength={999}
              >
                {content}
              </textarea>
              <div className="review-content-length">{content.length}/1000</div>
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
              uploadBoxHeight,
              uploadBoxHeight,
              uploadBoxHeight,
              uploadBoxHeight,
            ]}
            disableDrag
          >
            <Sheet.Container
              style={{
                borderRadius: '18px 18px 0px 0px',
                height: uploadBoxHeight,
              }}
            >
              <Sheet.Content>
                <main
                  className="capture-img-record ios-capture-record"
                  style={{
                    height: uploadBoxHeight,
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
                          cert === 'manual'
                            ? (e) =>
                                dispatch(uploadAction.setTitle({ title: e.target.value }))
                            : undefined
                        }
                        onClick={
                          cert === ''
                            ? () => {
                              const textareas = document.getElementsByClassName("review-content");
                              for (let i = 0; i < textareas.length; i++) {
                                const textarea = textareas[i] as HTMLTextAreaElement;
                                textarea.blur();
                              }
                              setTimeout(()=>{
                                navigate(UPLOAD_PATH.LOCATION)
                              },500)
                              }
                            : undefined
                        }
                        readOnly={cert !== 'manual'}
                        disabled={cert === 'mungple'}
                        value={title !== '' ? title : undefined}
                      />
                    </div>
                    {mongPlaceId === 0 && (
                      <div className="review-place-address-hide">
                        <div style={{ display: 'flex' }}>
                          {isHideAddress ? (
                            <img
                              src={CheckBox}
                              onClick={() =>
                                dispatch(
                                  uploadAction.setHideAddress({
                                    isHideAddress: !isHideAddress,
                                  }),
                                )
                              }
                            />
                          ) : (
                            <input
                              className="review-place-address-hide-button"
                              type="checkbox"
                              onClick={() =>
                                dispatch(
                                  uploadAction.setHideAddress({
                                    isHideAddress: !isHideAddress,
                                  }),
                                )
                              }
                            />
                          )}
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
                      maxLength={999}
                    >
                      {content}
                    </textarea>
                    <div className="review-content-length">{content.length}/1000</div>
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
