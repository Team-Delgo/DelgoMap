import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { UPLOAD_PATH } from '../../common/constants/path.const';
import Crop from '../../common/utils/Crop';
import getCroppedImg from '../../common/utils/CropHandle';
import { uploadAction } from '../../redux/slice/uploadSlice';
import { RootState } from '../../redux/store';
import DogLoading from '../../common/utils/BallLoading';

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

function CropListPage() {
  const [croppedAreaPixel, setCropAreaPixel] = useState<CroppendAreaPixelType>();
  const [croppedAreaPixelList, setCroppedAreaPixelList] = useState<
    CroppendAreaPixelType[]
  >([]);
  const [cropList, setCropList] = useState<CropType[]>([]);
  const [zoomList, setZoomList] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { prevImgList, prevImgNameList } = useSelector(
    (state: RootState) => state.persist.upload,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCropAreaPixel(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      setIsLoading(true);
      let finalCropList: CroppendAreaPixelType[];

      if (currentImageIndex === prevImgList.length - 1 && croppedAreaPixel) {
        finalCropList = [...croppedAreaPixelList, croppedAreaPixel];
      }

      const cropPromises = prevImgList.map((image, index) =>
        getCroppedImg(image, finalCropList[index]),
      );

      const blobFiles = await Promise.all(cropPromises);

      const newFiles = blobFiles.map((blobFile, index) => {
        const metadata = { type: `image/jpeg` };
        return new File([blobFile as Blob], prevImgNameList[index], metadata);
      });

      const croppedImages = newFiles.map((file) => URL.createObjectURL(file));

      dispatch(uploadAction.setImgList({ imgList: croppedImages, fileList: newFiles }));
      moveToNextPage();
    } catch (e) {
      console.error(e);
    }
    finally{
      setIsLoading(false)
    }
  };

  const moveToPrevPage = () => {
    navigate(-1);
  };

  const moveToNextPage = useCallback(() => {
    if (location?.state?.prevPath === 'homeMap') {
      navigate(UPLOAD_PATH.CERTIFICATION);
    } else if (location?.state?.prevPath === '/camera/captureImg/location') {
      navigate(UPLOAD_PATH.LOCATION);
    } else {
      navigate(UPLOAD_PATH.CERTIFICATION);
    }
  }, []);

  return (
    <>
      {isLoading && <DogLoading />}
      <Crop
        currentImageIndex={currentImageIndex}
        ImgListLength={prevImgList.length}
        img={prevImgList[currentImageIndex]}
        croppedAreaPixelList={croppedAreaPixelList}
        croppedAreaPixel={croppedAreaPixel}
        zoomList={zoomList}
        cropList={cropList}
        cancleImgCrop={moveToPrevPage}
        showCroppedImage={showCroppedImage}
        onCropComplete={onCropComplete}
        setCurrentImageIndex={setCurrentImageIndex}
        setCroppedAreaPixelList={setCroppedAreaPixelList}
        setZoomList={setZoomList}
        setCropList={setCropList}
      />
    </>
  );
}

export default CropListPage;
