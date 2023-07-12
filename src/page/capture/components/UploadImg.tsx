import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { UPLOAD_PATH, CROP_PATH, ROOT_PATH } from '../../../common/constants/path.const';
import PrevArrowBlack from '../../../common/icons/prev-arrow-black.svg';
import X from '../../../common/icons/xx.svg';
import DeleteBottomSheet from '../../../common/dialog/ConfirmBottomSheet';
import useActive from '../../../common/hooks/useActive';

function UploadImg() {
  const [bottomSheetIsOpen, openBottomSheet, closeBottomSheet] = useActive(false);
  const { img } = useSelector((state: RootState) => state.persist.upload);
  const navigate = useNavigate();
  const location = useLocation();
  const eventTargetRef = useRef<HTMLDivElement | null>(null);

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
  

  const moveToPreviousPage = () => {
    if (location.pathname === UPLOAD_PATH.CAPTURE) navigate(CROP_PATH);
    else navigate(UPLOAD_PATH.CAPTURE);
  };

  const moveToHomePage = () => {
    navigate(ROOT_PATH);
  };

  return (
    <>
      <img
        src={PrevArrowBlack}
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
      <div ref={eventTargetRef}>
        <img
          className="captured-img"
          src={img}
          width={window.innerWidth}
          height={window.innerWidth}
          alt="caputeImg"
        />
      </div>
      <DeleteBottomSheet
        text="작성중이던 기록이 삭제됩니다"
        description="지우면 다시 볼 수 없어요"
        cancelText="이어서 기록"
        acceptText="삭제 후 홈으로"
        acceptButtonHandler={moveToHomePage}
        cancelButtonHandler={closeBottomSheet}
        bottomSheetIsOpen={bottomSheetIsOpen}
      />
    </>
  );
}

export default UploadImg;
