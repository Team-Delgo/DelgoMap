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
import { compressFormData, blobFormData ,blobFormDataForMultipleFiles} from '../../../common/utils/FormData';
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
    cert
  } = useSelector((state: RootState) => state.persist.upload);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const certCompleteEvent = useAnalyticsCustomLogEvent(analytics, 'cert_end');
  let icon = FootPrintSmall;

  //카테고리 코드에따라 아이콘설정
  if (categoryCode === 'CA0001') icon = WalkSmall;
  else if (categoryCode === 'CA0002') icon = CafeSmall;
  else if (categoryCode === 'CA0003') icon = EatSmall;
  else if (categoryCode === 'CA0004') icon = BathSmall;
  else if (categoryCode === 'CA0005') icon = BeautySmall;
  else if (categoryCode === 'CA0006') icon = HospitalSmall;
  else if (categoryCode === 'CA0007') icon = KinderSmall;

  //sheet설정 -> 이부분은 기본적으로 화면 브라우저크기(모바일크기)에 따라 style이 바뀌므로 scss파일대신 인라인으로 설정해줘야함
  const sheetStyle = {
    borderRadius: '18px 18px 0px 0px',
    height: window.innerHeight - window.innerWidth + 10, //업로드박스 높이는 뷰포트 높이-넓이+10 설정 (다른값으로 하면 무조건 화면꺠짐 겨우찾은 비율)
  };

  useEffect(() => {
    if (errorToastIsOpen) {
      setTimeout(() => {
        closeCertificateErrorToast();
      }, 2000);
    }
  }, [errorToastIsOpen]);

  //인증등록 api hook
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
          //성공하면 인증Id 를 저장해줌 (나중에 인증하고 바로 수정할때 필요함)
          dispatch(
            uploadAction.setCertificationId({
              certificationId: response.data.data.certificationId,
            }),
          );
          moveToUploadResultPage(); //결과페이지 이동
        } else if (code === 314) {
          //200이 아니면 기본적으로 성공이아닌데 api 스펙보고 분기처리해서 처리해주면 됨
          offPostCertificationLoading(); //인증로딩 off
          setCertificateErrorToastMessage('카테고리당 하루 5번까지 인증 가능합니다'); //toast text설정
          openCertificateErrorToast(); //toast open
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

  //인증업로드 핸들러
  const uploadGalleryImgCertification = async () => {
    if (postCertificationIsLoading) {
      return;
    }
    //해당 조건문값들은 서버에서 api호출하기전에 미리 프론트에서 막아줌
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

    console.log('fileList',fileList)
    const formData = blobFormDataForMultipleFiles(data, fileList); //utils에 정의된 blobFormData호출후 반환된 formData이용
    // const compressedFormData = await compressFormData(formData); //폼데이터 압축해주고

    registerMutation.mutate(formData);
  };

  const moveToUploadResultPage = useCallback(() => {
    navigate(UPLOAD_PATH.RESULT, {
      state: {
        prevPath: location?.pathname,
      },
    });
  }, []);

  //운영체제에따라 업로드박스(하단 흰색부분) 을 랜더링해줌 (모바일상에서 키패드가올라오면 업로드박스를 키패드위로 올려야하는데)
  //ios경우 position:fixed 속성으로 해결할 수 있는반면, android같은경우 react-modal-sheet 라이브러리 Sheet 를 이용해 해결
  //코드가 길면 각 부분을 컴포넌트로 추상화시켜서 사용해도 됨
  const renderContentByOS = () => {
    switch (OS) {
      case 'ios':
        return (
          <main
            className="capture-img-record ios-capture-record"
            style={{
              height: window.innerHeight - window.innerWidth + 10,
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
                    cert === "manual"
                      ? (e) => dispatch(uploadAction.setTitle({ title: e.target.value })) //타이틀도 store에 저장해줌(장소선택페이지 이동후 되돌아올때 store에서 꺼내서 사용해야됨)
                      : undefined
                  }
                  onFocus={
                    cert === ""
                      ? () => {
                        setTimeout(()=>{
                          navigate(UPLOAD_PATH.LOCATION)
                        },100)
                      }
                      : undefined
                  }
                  disabled={cert === 'mungple'}
                  value={title !== '' ? title : undefined}
                />
              </div>

              {mongPlaceId === 0 && (
                <div className="review-place-address-hide">
                  <div style={{ display: 'flex' }}>
                    {
                      isHideAddress ? <img src={CheckBox} onClick={() =>
                        dispatch( //주소공개여부 store에 저장해줌(장소선택페이지 이동후 되돌아올때 store에서 꺼내서 사용해야됨)
                          uploadAction.setHideAddress({
                            isHideAddress: !isHideAddress,
                          }),
                        )
                      } />
                        : <input
                          className="review-place-address-hide-button"
                          type="checkbox"
                          onClick={() =>
                            dispatch( //주소공개여부 store에 저장해줌(장소선택페이지 이동후 되돌아올때 store에서 꺼내서 사용해야됨)
                              uploadAction.setHideAddress({
                                isHideAddress: !isHideAddress,
                              }),
                            )
                          }
                        />
                    }
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
                  dispatch( //내용도 store에 저장해줌(장소선택페이지 이동후 되돌아올때 store에서 꺼내서 사용해야됨)
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
              window.innerHeight - window.innerWidth + 10,
              window.innerHeight - window.innerWidth + 10,
              window.innerHeight - window.innerWidth + 10,
              window.innerHeight - window.innerWidth + 10,
            ]}
            disableDrag
          >
            <Sheet.Container style={sheetStyle}>
              <Sheet.Content>
                <main
                  className="capture-img-record ios-capture-record"
                  style={{
                    height: window.innerHeight - window.innerWidth + 10,
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
                        onFocus={
                          cert === ""
                            ? () => {
                              setTimeout(()=>{
                                navigate(UPLOAD_PATH.LOCATION)
                              },100)
                            }
                            : undefined
                        }
                        disabled={cert === 'mungple'}
                        value={title !== '' ? title : undefined}
                      />
                    </div>
                    {mongPlaceId === 0 && (
                      <div className="review-place-address-hide">
                        <div style={{ display: 'flex' }}>
                          {
                            isHideAddress ? <img src={CheckBox} onClick={() =>
                              dispatch( //주소공개여부 store에 저장해줌(장소선택페이지 이동후 되돌아올때 store에서 꺼내서 사용해야됨)
                                uploadAction.setHideAddress({
                                  isHideAddress: !isHideAddress,
                                }),
                              )
                            } />
                              : <input
                                className="review-place-address-hide-button"
                                type="checkbox"
                                onClick={() =>
                                  dispatch( //주소공개여부 store에 저장해줌(장소선택페이지 이동후 되돌아올때 store에서 꺼내서 사용해야됨)
                                    uploadAction.setHideAddress({
                                      isHideAddress: !isHideAddress,
                                    }),
                                  )
                                }
                              />
                          }
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
