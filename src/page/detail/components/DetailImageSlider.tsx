import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface Props {
  images: string[];
  openFullSlider: (index:number)=>void;
}

function DetailImageSlider({ images, openFullSlider }: Props) {
  const [imageNumber, setImageNumber] = useState(0);

  return (
    <div className="detail-img">
      <Swiper onSlideChange={(swiper) => setImageNumber(swiper.activeIndex)}>
        {images.map((image, index) => {
          return (
            <SwiperSlide>
              <img src={image} alt="placeimage" aria-hidden onClick={()=>openFullSlider(index)}/>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="detail-img-number">{imageNumber + 1} / {images.length}</div>
    </div>
  );
}

export default DetailImageSlider;
