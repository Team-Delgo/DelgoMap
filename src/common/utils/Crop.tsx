import React, { useState } from 'react';
import Cropper from 'react-easy-crop'; //이미지 crop 핸들링 해주는 라이브러리
import PrevArrowWhite from '../icons/prev-arrow-white.svg';
import WhiteCheck from '../icons/white-check.svg';
import "./Crop.scss";

interface CropType {
  img: string;
  cancleImgCrop: () => void;
  showCroppedImage: () => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
}

function Crop({ img, cancleImgCrop, showCroppedImage, onCropComplete }: CropType) {
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // 이미지의 자르기 위치를 상태로 관리
  const [zoom, setZoom] = useState(1); // 이미지의 확대/축소 레벨을 상태로 관리

  return (
    <div className="crop-container">
      <img
        src={PrevArrowWhite}
        className="crop-container-prev-arrow"
        alt="crop-wrapper-prev-arrow"
        aria-hidden="true"
        onClick={cancleImgCrop}  // 이미지 자르기 취소 핸들러
      />
      <img
        src={WhiteCheck}
        className="crop-container-complition-check"
        alt="crop-wrapper-complition-check"
        aria-hidden="true"
        onClick={showCroppedImage} // 이미지 자르기 완료 핸들러
      />
      <Cropper
        image={img}
        crop={crop}
        zoom={zoom}
        aspect={1}  // 이미지의 종횡비(1은 정사각형을 의미)
        onCropChange={setCrop}  // crop 상태를 업데이트하는 함수
        onCropComplete={onCropComplete}  // 이미지 자르기가 완료될 때 호출되는 함수
        onZoomChange={setZoom}  // zoom 상태를 업데이트하는 함수
      />
    </div>
  );
}

export default Crop
