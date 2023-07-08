import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Exit from '../../../common/icons/exit.svg';

interface Props {
  images: string[];
  index: number;
  placeName: string;
  close: () => void;
}

function FullScreenImageSlider({ images, index, placeName, close }: Props) {
  const [imageNumber, setImageNumber] = useState(index);

  return (
    <div className="absolute z-[200] w-screen h-screen bg-white">
      <div className="absolute w-screen pt-[9px] h-[40px] bg-white flex justify-center font-[500] text-lg">
        {placeName}
        <img
          className="absolute right-5 w-[15px] h-[15px]"
          src={Exit}
          alt="exit"
          aria-hidden
          onClick={close}
        />
      </div>
      <div className="absolute top-10 left-[50%] -translate-x-[50%] text-sm font-normal tracking-tight">
        {imageNumber + 1} / {images.length}
      </div>
      <div className="flex h-full items-center">
        <Swiper
          slidesPerView="auto"
          centeredSlides
          initialSlide={index}
          onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}
        >
          {images.map((image) => {
            return (
              <SwiperSlide>
                <img
                  className="max-h-[80vh] overflow-hidden w-screen"
                  src={image}
                  alt="placeimage"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default FullScreenImageSlider;
