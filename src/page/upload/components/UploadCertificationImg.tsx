import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PrevArrowWhite from '../../../common/icons/prev-arrow-white.svg';
import X from '../../../common/icons/white-x.svg';
import Camera from '../../../common/icons/camera.svg';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { CROP_PATH,CROP_LIST_PATH } from '../../../common/constants/path.const';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import useActive from '../../../common/hooks/useActive';
import ToastPurpleMessage from '../../../common/dialog/ToastPurpleMessage';

interface props {
  openBottomSheet: () => void;
}

function UploadCertificationImg({ openBottomSheet }: props) {
  const [uploadImgList,setUploadImgList] = useState([])
  const [imageNumber, setImageNumber] = useState(0);
  const img = useSelector((state: RootState) => state.persist.upload.img);
  const imgList = useSelector((state: RootState) => state.persist.upload.imgList);
  const navigate = useNavigate();
  const eventTargetRef = useRef<HTMLDivElement | null>(null); //이미지 전체 div 참조하는 ref객체
  const fileUploadRef = useRef<HTMLInputElement>(null); // input file 참조하는 ref객체
  const dispatch = useDispatch();
  const location = useLocation();
  const [errorToastIsOpen, openCertificateErrorToast, closeCertificateErrorToast] =
  useActive(false);


  //이벤트 발생 막는함수
  const handleDragStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
  };
//해당 전체 div박스 손으로 터치후 이동하는거 막기위한 설정 (기획이나 요구사항 바꾸면 지워도됨 )
  useEffect(() => {
    const eventTarget = eventTargetRef.current;
    if (eventTarget) {
      eventTarget.addEventListener('mousedown', handleDragStart, { passive: false });
      eventTarget.addEventListener('touchmove', handleDragStart, { passive: false });
    }

    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('mousedown', handleDragStart);
        eventTarget.removeEventListener('touchmove', handleDragStart);
      }
    };
  }, []);

  //upload과정에서 크롭하기전에 prevImg를 store에 저장해주는부분
  const setPevImg = (event: { target: HTMLInputElement }) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files); // FileList를 배열로 변환


      if (fileArray.length > 5) {
        openCertificateErrorToast();
        setTimeout(()=>{
          closeCertificateErrorToast();
        },2000)
        return

      }

      const galleryImgURLs = fileArray.map(file => URL.createObjectURL(file));
      const galleryImgNames = fileArray.map(file => file.name);

      dispatch(
        uploadAction.setPrevImgList({ prevImgList: galleryImgURLs, prevImgNameList: galleryImgNames })
      );



      // const galleryImg = URL.createObjectURL(event.target.files[0]); //파일 url생성해주고 (브라우저에 랜더링위해 이미지 url필요)
      // const galleryImgName = event.target.files[0].name; //이미지 네임 저장하고
      // dispatch(
      //   uploadAction.setPrevImg({ prevImg: galleryImg, prevImgName: galleryImgName }), //prevImg를 스토어에 저장
      // );
      navigate(CROP_LIST_PATH, { state: { prevPath: location.pathname } }); //cropPage로 이동 (cropPage에서 분기처리를 위해 prevPath를 보내줌)
    }
  };

  const openFileGallery = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click(); //input file 클릭 (ref 객체를 이용해 input file을 클릭하는이유는 input이 화면상에 보여지면 안되서)
    }
  };

  const moveToPreviousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div ref={eventTargetRef}>
        {imgList.length === 0 ? (
          <div
            className="capture-certification-void-img"
            style={{
              width: window.innerWidth, //이미지는 기본적으로 가로세로 정사각형이다
              height: window.innerWidth, //따라서 이미지 높이도 해당 뷰의 넓이만큼설정
            }}
          >
            <div
              style={{
                height: window.innerWidth - 21, //이미지높이 - 업로드박스높이만큼 높이설정후 사진추가 버튼을 가로세로 정중앙해줌
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
              }}
            >
              <div
                className="capture-certification-img-addition-btn"
                onClick={openFileGallery}
                aria-hidden
              >
                <img src={Camera} alt="camera-icon" width={14} height={14} />
                <p style={{padding:"0 4px"}} />
                <div>사진 (0/5)</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
              {imgList.map((image: string) => {
                return (
                  <SwiperSlide>
                    <img
                      className="capture-certification-img"
                      src={image}
                      width={window.innerWidth}
                      height={window.innerWidth}
                      alt="caputeImg"
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {/* <div className="absolute bottom-[4px] right-[4px] z-[100] flex h-[23px] w-[55px] items-center justify-center bg-gray-700 bg-opacity-70 text-[11px] font-normal text-white">
              {imageNumber + 1} / {imgList.length}
            </div> */}
          </div>
        )}
      </div>
      <img
        src={PrevArrowWhite}
        className="capture-page-prev-arrow"
        alt="capture-page-prev-arrow"
        aria-hidden="true"
        onClick={moveToPreviousPage}
      />
      <img
        src={X}
        className="capture-page-x"
        alt="capture-page-x"
        aria-hidden="true"
        onClick={openBottomSheet}
      />
      <input
        type="file"
        accept="image/jpeg,image/gif,image/png,image/jpg;capture=filesystem"
        multiple
        ref={fileUploadRef}
        onChange={setPevImg}
        style={{ display: 'none' }}
      />
      {
        errorToastIsOpen && <ToastPurpleMessage message="이미지는 최대 5장 업로드 가능합니다." />
      }
    </>
  );
}

export default UploadCertificationImg;
