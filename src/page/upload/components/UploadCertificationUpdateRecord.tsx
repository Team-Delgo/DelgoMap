import React, { useCallback, useState, useEffect, useRef } from 'react';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import Sheet from 'react-modal-sheet';
import { updateCertificationPost } from '../../../common/api/certification';
import { UPLOAD_PATH } from '../../../common/constants/path.const';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import useActive from '../../../common/hooks/useActive';
import useInput from '../../../common/hooks/useInput';
import BallLoading from '../../../common/utils/BallLoading';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';
import FootPrintSmall from '../../../common/icons/foot-print-small.svg';
import ToastPurpleMessage from '../../../common/dialog/ToastPurpleMessage';

interface updateCertPostData {
  certificationId: number;
  description: string;
  userId: number;
  isHideAddress: boolean;
}

function UploadCertificationUpdateRecord() {
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const {
    title,
    certificationId,
    content,
    address,
    isHideAddress,
    categoryCode,
  } = useSelector((state: RootState) => state.persist.upload);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const [certificateErrorToastMessage, setCertificateErrorToastMessage] = useState('');
  const [buttonDisabled, onButtonDisable, OffButtonDisable] = useActive(false);
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  const [
    updateCertificationIsLoading,
    onUpdateCertificationLoading,
    offUpdateCertificationLoading,
  ] = useActive(false);
  const [errorToastIsOpen, openCertificateErrorToast, closeCertificateErrorToast] =
    useActive(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location: any = useLocation();
  const initialHeight = useRef(window.innerHeight);

  const sheetStyle = {
    borderRadius: '18px 18px 0px 0px',
    height: initialHeight.current - window.innerWidth - 10,
  };

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

  const { mutate: updateCertificationMutate } = useMutation(
    (data: updateCertPostData) => updateCertificationPost(data),
    {
      onSuccess: (response: AxiosResponse) => {
        console.log('response', response);
        const { code, data } = response.data;
        if (code === 200) {
          dispatch(
            uploadAction.setContent({
              content: data.description,
              achievements: [],
            }),
          );
          moveToCaptureResultPage();
        } else {
          offUpdateCertificationLoading();
          OffButtonDisable();
        }
      },
      onError: () => {
        offUpdateCertificationLoading();
        OffButtonDisable();
      },
    },
  );

  const uploadCertificationPost = () => {
    if (buttonDisabled || updateCertificationIsLoading) {
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
    onUpdateCertificationLoading();
    onButtonDisable();

    console.log('isHideAddress',isHideAddress)

    setTimeout(() => {
      updateCertificationMutate({
        certificationId,
        description: content,
        userId: user.id,
        isHideAddress,
      });
    }, 1000);
  };

  const moveToCaptureResultPage = useCallback(() => {
    navigate(UPLOAD_PATH.RESULT, {
      state: {
        prevPath: location.pathname,
        prevPrevPath: location?.state?.prevPath,
        updateSuccess: true,
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
                  disabled
                  value={title !== '' ? title : undefined}
                />
                {/* <div className="review-place-info-address">{address}</div> */}
              </div>

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
                  onClick={uploadCertificationPost}
                >
                  수정완료
                </div>
              ) : (
                <div className="writting-button">수정완료</div>
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
            className="modal-bottom-sheet"
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
                        onFocus={() => navigate(UPLOAD_PATH.LOCATION)}
                        value={title !== '' ? title : undefined}
                      />
                      {/* <div className="review-place-info-address">{address}</div> */}
                    </div>

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
                        <div style={{ position: 'relative'}}>
                          <div className="review-place-address-hide-box">
                            다른 사용자에게는 장소이름만 보여요
                          </div>
                          <div className="review-place-address-hide-arrow" />
                        </div>
                      )}
                    </div>

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
                        onClick={uploadCertificationPost}
                      >
                        수정완료
                      </div>
                    ) : (
                      <div className="writting-button">수정완료</div>
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
      {updateCertificationIsLoading && <BallLoading />}
      {renderContentByOS()}
      {errorToastIsOpen && <ToastPurpleMessage message={certificateErrorToastMessage} />}
    </>
  );
}

export default UploadCertificationUpdateRecord;
