import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CAMERA_PATH, ROOT_PATH } from '../../common/constants/path.const';
import Crop from '../../common/utils/Crop';
import getCroppedImg from '../../common/utils/CropHandle';
import { uploadAction } from '../../redux/slice/uploadSlice';
import { RootState } from '../../redux/store';
import { croppendAreaPixelType } from '../sign/signup/petinfo/petInfoType';

function CropPage() {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<croppendAreaPixelType>();
  const { prevImg, prevImgName } = useSelector((state: RootState) => state.persist.upload);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const blobFile = await getCroppedImg(prevImg, croppedAreaPixels);

      const metadata = { type: `image/jpeg` };
      const newFile = new File([blobFile as Blob], prevImgName, metadata);
      const croppedImage = URL.createObjectURL(newFile);

      dispatch(uploadAction.setImg({ img: croppedImage, tool: 'gallery', file: newFile }));
      moveToNextPage();
    } catch (e) {
      console.error(e);
    }
  };

  const moveToPrevPage = useCallback(() => {
    navigate(ROOT_PATH);
  }, []);

  const moveToNextPage = useCallback(() => {
    navigate(CAMERA_PATH.LOCATION);
  }, []);

  return <Crop img={prevImg} cancleImgCrop={moveToPrevPage} showCroppedImage={showCroppedImage} onCropComplete={onCropComplete} />;
}

export default CropPage;