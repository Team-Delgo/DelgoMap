import React, { useCallback, useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { UPLOAD_PATH } from '../../common/constants/path.const';
import Crop from '../../common/utils/Crop';
import getCroppedImg from '../../common/utils/CropHandle';
import { uploadAction } from '../../redux/slice/uploadSlice';
import { RootState } from '../../redux/store';
import { croppendAreaPixelType } from '../sign/signup/petinfo/petInfoType';

function CropListPage() {
  const [cropImgList, setCropImgList] = useState<string[]>([]);
  const [cropFileList, setCropFileList] = useState<File[]>([]);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<croppendAreaPixelType>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { prevImg, prevImgName,prevImgList,prevImgNameList } = useSelector(
    (state: RootState) => state.persist.upload,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentImageIndex === prevImgList.length - 1 && cropImgList.length === 3) {
      dispatch(uploadAction.setImgList({ imgList: cropImgList,  fileList: cropFileList }));
      moveToNextPage();
    }
  }, [cropImgList, currentImageIndex]);

  // 이미지를 pixel 단위로 크롭
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 크롭된 이미지를 생성하고 리덕스 스토어에 저장
  const showCroppedImage = async () => {
    try {
      // const blobFile = await getCroppedImg(prevImg, croppedAreaPixels); //file -> blob 형식으로 바꾹고

      const blobFile = await getCroppedImg(prevImgList[currentImageIndex], croppedAreaPixels);
      const metadata = { type: `image/jpeg` }; // 크롭된 이미지의 메타데이터 설정
      const newFile = new File([blobFile as Blob], prevImgNameList[currentImageIndex], metadata); //blob파일,원본이미지명,메타데이터 파라미터로 넣고 새로운 file 객체 생성
      const croppedImage = URL.createObjectURL(newFile); // 생성된 File 객체를 URL로 변환(브라우저에서 이 URL을 통해 크롭된 이미지를 렌더링할 수 있음)

      setCropImgList(prevList => [...prevList, croppedImage]);
      setCropFileList(prevList => [...prevList, newFile]);


      if (currentImageIndex < prevImgList.length - 1) {
        setCurrentImageIndex(prev => prev + 1); // 다음 이미지로
      } 
      
    } catch (e) {
      console.error(e);
    }
  };

  const moveToPrevPage = useCallback(() => {
    navigate(-1);
  }, []);

  //이전 페이지에 따라 분기처리해서 화면이동
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
    <Crop
      // img={prevImg}
      img={prevImgList[currentImageIndex]}
      cancleImgCrop={moveToPrevPage}
      showCroppedImage={showCroppedImage}
      onCropComplete={onCropComplete}
    />
  );
}

export default CropListPage;
