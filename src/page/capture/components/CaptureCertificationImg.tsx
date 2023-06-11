import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PrevArrowWhite from '../../../common/icons/prev-arrow-white.svg';
import X from '../../../common/icons/white-x.svg';
import Camera from '../../../common/icons/camera.svg';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { CROP_PATH } from '../../../common/constants/path.const';

interface CaptureCertificationImgPropsType {
  openBottomSheet: () => void;
}

function CaptureCertificationImg({ openBottomSheet }: CaptureCertificationImgPropsType) {
  const img = useSelector((state: RootState) => state.persist.upload.img);
  const navigate = useNavigate();
  const eventTargetRef = useRef<HTMLDivElement | null>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  

  const handleDragStart = (e: any) => {
    e.preventDefault();
  };

  useEffect(() => {
    const eventTarget = eventTargetRef.current;
    if (eventTarget) {
      eventTarget.addEventListener('mousedown', handleDragStart, { passive: false });
      eventTarget.addEventListener('touchmove', handleDragStart, { passive: false });
    }

    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('mousedown', handleDragStart);
        eventTarget.removeEventListener('touchmove', handleDragStart);
      }
    };
  }, []);

  const setPevImg = (event: { target: HTMLInputElement }) => {
    if (event.target.files) {
      const galleryImg = URL.createObjectURL(event.target.files[0]);
      const galleryImgName = event.target.files[0].name;
      dispatch(uploadAction.setPrevImg({ prevImg: galleryImg, prevImgName: galleryImgName }));
      navigate(CROP_PATH, { state: { prevPath: location.pathname } });
    }
  };

  const openFileGallery = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const moveToPreviousPage = () => {
    navigate(-1);
  };

  return (
    <>
      <div ref={eventTargetRef}>
        {img === '' ? (
          <div
            className="capture-certification-void-img"
            style={{
              width: window.innerWidth,
              height: window.innerWidth,
            }}
          >
            <div className="capture-certification-img-addition-btn" onClick={openFileGallery} aria-hidden>
              <img src={Camera} alt="camera-icon" />
              <div>사진 추가</div>
            </div>
          </div>
        ) : (
          <img
            className="capture-certification-img"
            src={img}
            width={window.innerWidth}
            height={window.innerWidth}
            alt="caputeImg"
          />
        )}
      </div>
      <img
        src={PrevArrowWhite}
        className="capture-page-prev-arrow"
        alt="capture-page-prev-arrow"
        aria-hidden="true"
        onClick={moveToPreviousPage}
      />
      <img
        src={X}
        className="capture-page-x"
        alt="capture-page-x"
        aria-hidden="true"
        onClick={openBottomSheet}
      />
            <input
        type="file"
        accept="image/jpeg,image/gif,image/png,image/jpg;capture=filesystem"
        ref={fileUploadRef}
        onChange={setPevImg}
        style={{ display: 'none' }}
      />
    </>
  );
}

export default CaptureCertificationImg;
