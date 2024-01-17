import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Zoom } from 'swiper';
import 'swiper/css';
import 'swiper/css/zoom';
import Exit from '../../../common/icons/exit.svg';


SwiperCore.use([Zoom]);
interface Props {
  images: string[];
  index: number;
  placeName: string;
  close: () => void;
}

function FullScreenImageSlider({ images, index, placeName, close }: Props) {
  const [imageNumber, setImageNumber] = useState(index);

  return (
    <div className="absolute z-[200] h-screen w-screen bg-white">
      <div className="absolute flex h-[40px] w-screen justify-center bg-white pt-[9px] text-lg font-[500]">
        {placeName}
        <img
          className="absolute right-5 h-[15px] w-[15px]"
          src={Exit}
          alt="exit"
          aria-hidden
          onClick={close}
        />
      </div>
      <div className="absolute left-[50%] top-10 -translate-x-[50%] text-sm font-normal tracking-tight">
        {imageNumber + 1} / {images.length}
      </div>
      <div className="flex h-full items-center">
        <Swiper
          slidesPerView="auto"
          centeredSlides
          initialSlide={index}
          zoom={true}
          onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}
        >
          {images.map((image) => {
            return (
              <SwiperSlide>
                <div className="swiper-zoom-container">
                  <img
                    className="max-h-[80vh] w-screen overflow-hidden"
                    src={image}
                    alt="placeimage"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default FullScreenImageSlider;
