import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PrevArrowWhite from '../../../common/icons/prev-arrow-white.svg';
import X from '../../../common/icons/white-x.svg';

interface CaptureCertificationImgPropsType {
  openBottomSheet: () => void;
}

function CaptureCertificationImg({ openBottomSheet }: CaptureCertificationImgPropsType) {
  const img = useSelector((state: RootState) => state.persist.upload.img);
  const navigate = useNavigate();
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
    navigate(-1);
  };

  return (
    <>
      <div ref={eventTargetRef}>
        <img
          className="capture-certification-img"
          src={img}
          width={window.innerWidth}
          height={window.innerWidth}
          alt="caputeImg"
        />
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
    </>
  );
}

export default CaptureCertificationImg;
