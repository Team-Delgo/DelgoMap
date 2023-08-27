import React, { useEffect, useRef,useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import WhiteX from '../../../common/icons/white-x.svg';
import { UPLOAD_PATH } from '../../../common/constants/path.const';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';


//인증수정 img부분(uploadCertificationImg와 동일하게 이해하면됨)
function UploadCertificationUpdateImg() {
  const [imageNumber, setImageNumber] = useState(0);
  const imgList = useSelector((state: RootState) => state.persist.upload.imgList);
  const navigate = useNavigate();
  const location: any = useLocation();
  const eventTargetRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: any) => {
    e.preventDefault();
  };

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

  //
  const moveToPreviousPage = () => {
    if (location?.state?.prevPath === UPLOAD_PATH.RESULT) {
      navigate(UPLOAD_PATH.RESULT, {
        state: {
          prevPath: location.pathname,
          prevPrevPath: location?.state?.prevPath,
          updateSuccess: false,
        },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <div ref={eventTargetRef}>
        <>
          <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
            {imgList.map((image: string) => {
              return (
                <SwiperSlide>
                  <img
                    className="capture-update-img"
                    src={image}
                    width={window.innerWidth}
                    height={window.innerWidth}
                    alt="caputeImg"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="absolute bottom-[5px] right-0 z-[100] flex h-[23px] w-[55px] items-center justify-center bg-gray-700 bg-opacity-70 text-[11px] font-normal text-white ">
            {imageNumber + 1} / {imgList.length}
          </div>
        </>
      </div>
      <img
        src={WhiteX}
        className="capture-category-update-page-prev-arrow"
        alt="capture-category-update-page-prev-arrow"
        aria-hidden="true"
        onClick={moveToPreviousPage}
      />
    </>
  );
}

export default UploadCertificationUpdateImg;
