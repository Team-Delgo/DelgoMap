import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface Props {
  images: string[];
  openFullSlider: (index: number) => void;
}

function DetailImageSlider({ images, openFullSlider }: Props) {
  const [imageNumber, setImageNumber] = useState(0);

  return (
    <div className="relative">
      <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
        {images.map((image, index) => {
          return (
            <SwiperSlide>
              <img
                className="w-screen h-[100vw] overflow-hidden"
                src={image}
                alt="placeimage"
                aria-hidden
                onClick={() => openFullSlider(index)}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="absolute z-[100] flex items-center justify-center text-white text-[11px] font-normal right-0 bottom-[5px] w-[55px] h-[23px] bg-gray-700 bg-opacity-70 ">
        {imageNumber + 1} / {images.length}
      </div>
    </div>
  );
}

export default DetailImageSlider;
