import React, { useState, MouseEventHandler, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import WhiteX from '../icons/white-x.svg';
import './Crop.scss';

interface CropType {
  x: number;
  y: number;
}

interface CroppendAreaPixelType {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface Props {
  currentImageIndex?: number;
  ImgListLength?: number;
  img: string;
  croppedAreaPixelList?: CroppendAreaPixelType[];
  croppedAreaPixel?: CroppendAreaPixelType;
  zoomList?: number[];
  cropList?: CropType[];
  cancleImgCrop: () => void;
  showCroppedImage: () => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  setCurrentImageIndex?: (idx: number) => void;
  setCroppedAreaPixelList?: (pixelList: CroppendAreaPixelType[]) => void;
  setZoomList?: (list: number[]) => void;
  setCropList?: (cropList: CropType[]) => void;
}

function Crop({
  currentImageIndex,
  ImgListLength,
  img,
  croppedAreaPixelList,
  croppedAreaPixel,
  zoomList,
  cropList,
  cancleImgCrop,
  showCroppedImage,
  onCropComplete,
  setCurrentImageIndex,
  setCroppedAreaPixelList,
  setZoomList,
  setCropList,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const isSingleImage = () =>
    (currentImageIndex === undefined && ImgListLength === undefined) ||
    (currentImageIndex !== undefined && ImgListLength === 1);
  const isFirstImage = () =>
    setCurrentImageIndex !== undefined && currentImageIndex === 0;
  const isLastImage = () =>
    currentImageIndex !== undefined &&
    currentImageIndex + 1 === ImgListLength &&
    ImgListLength !== 1;
  const isMiddleImage = () =>
    setCurrentImageIndex !== undefined && currentImageIndex !== undefined;

  useEffect(() => {
    if (
      cropList &&
      currentImageIndex !== undefined &&
      currentImageIndex >= 0 &&
      cropList?.[currentImageIndex] &&
      zoomList
    ) {
      setCrop(cropList[currentImageIndex]);
      setZoom(zoomList[currentImageIndex]);
    }
    else{
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [currentImageIndex]);

  const handleUpdateCropData = (
    curIndex: number,
    moveIndex: number,
  ): MouseEventHandler<HTMLButtonElement> => {
    return () => {
      if (
        croppedAreaPixelList &&
        zoomList &&
        cropList &&
        croppedAreaPixel &&
        setCroppedAreaPixelList &&
        setZoomList &&
        setCropList &&
        setCurrentImageIndex
      ) {
        const newList: CroppendAreaPixelType[] = [...croppedAreaPixelList];
        const newZoomList: number[] = [...zoomList];
        const newCropList: CropType[] = [...cropList];

        newList[curIndex] = croppedAreaPixel;
        newZoomList[curIndex] = zoom;
        newCropList[curIndex] = crop;

        setCroppedAreaPixelList(newList);
        setZoomList(newZoomList);
        setCropList(newCropList);
        setCurrentImageIndex(moveIndex);
      }
    };
  };

  const renderCropBtn = () => (
    <div className="crop-btn-wrapper">
      <button className="crop-complte-btn" onClick={showCroppedImage}>
        자르기 완료
      </button>
    </div>
  );

  const renderFirstBtn = () => (
    <div className="crop-btn-wrapper">
      <button
        className="crop-first-btn"
        onClick={handleUpdateCropData(currentImageIndex!, currentImageIndex! + 1)}
      >
        다음
      </button>
    </div>
  );

  const renderMiddleBtn = () => (
    <div className="crop-btn-container">
      <div className="crop-btn-wrapper">
        <button
          className="crop-middle-btn"
          onClick={handleUpdateCropData(currentImageIndex!, currentImageIndex! - 1)}
        >
          이전
        </button>
        <div style={{ padding: '0 7.5px' }} />
        <button
          className="crop-middle-btn"
          onClick={handleUpdateCropData(currentImageIndex!, currentImageIndex! + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );

  const renderLastBtn = () => (
    <div className="crop-btn-container">
      <div className="crop-btn-wrapper">
        <button
          className="crop-middle-btn"
          onClick={handleUpdateCropData(currentImageIndex!, currentImageIndex! - 1)}
        >
          이전
        </button>
        <div style={{ padding: '0 7.5px' }} />
        <button className="crop-complte-half-btn" onClick={showCroppedImage}>
          자르기 완료
        </button>
      </div>
    </div>
  );

  const btnList = [
    { condition: isSingleImage, component: renderCropBtn },
    { condition: isLastImage, component: renderLastBtn },
    { condition: isFirstImage, component: renderFirstBtn },
    { condition: isMiddleImage, component: renderMiddleBtn },
  ];

  const renderButtons = () => {
    for (let btn of btnList) {
      if (btn.condition()) {
        return btn.component();
      }
    }
    return null;
  };

  return (
    <div className="crop-container">
      <img
        src={WhiteX}
        className="crop-container-prev-arrow"
        alt="crop-wrapper-prev-arrow"
        aria-hidden="true"
        onClick={cancleImgCrop}
      />
      <div className="crop-img-current-idx">
        {currentImageIndex !== undefined &&
          ImgListLength !== undefined &&
          `${currentImageIndex + 1} / ${ImgListLength}`}
      </div>
      <Cropper
        image={img}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop} 
        onCropComplete={onCropComplete} 
        onZoomChange={setZoom} 
      />
      {renderButtons()}
    </div>
  );
}

export default Crop;
