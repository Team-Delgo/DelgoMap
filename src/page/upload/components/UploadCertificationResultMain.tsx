import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

function UploadResultMain() {
  const [imageNumber, setImageNumber] = useState(0);
  const { title, content, address, isHideAddress, imgList } = useSelector(
    (state: RootState) => state.persist.upload,
  );

  //업로드 결과 컴포넌트

  return (
    <main className="capture-img-result-main">
      <>
        <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
          {imgList.map((image: string) => {
            return (
              <SwiperSlide>
                <img className="capture-img" src={image} alt="caputeImg" />
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* <div className="absolute bottom-[5px] right-0 z-[100] flex h-[23px] w-[55px] items-center justify-center bg-gray-700 bg-opacity-70 text-[11px] font-normal text-white ">
          {imageNumber + 1} / {imgList.length}
        </div> */}
      </>
      <header className="capture-img-result-main-header">
        <div className="capture-img-result-main-header-place">
          <div className="capture-img-result-main-header-place-name">{title}</div>
          {!isHideAddress && (
            <div className="capture-img-result-main-header-place-address">{address}</div>
          )}
        </div>
      </header>
      <body className="capture-img-result-main-body">{content}</body>
    </main>
  );
}

export default UploadResultMain;
