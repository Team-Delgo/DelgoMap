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
    <div className="detail-full">
      <div className="detail-full-header">
        {placeName}
        <img src={Exit} alt="exit" aria-hidden onClick={close} />
      </div>
      <div className="detail-full-image">
        <Swiper initialSlide={index} onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
          {images.map((image) => {
            return (
              <SwiperSlide>
                <img src={image} alt="placeimage" />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default FullScreenImageSlider;
