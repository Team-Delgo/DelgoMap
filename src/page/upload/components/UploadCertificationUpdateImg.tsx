import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import WhiteX from '../../../common/icons/white-x.svg';
import { UPLOAD_PATH } from '../../../common/constants/path.const';


function UploadCertificationUpdateImg() {
  const img = useSelector((state: RootState) => state.persist.upload.img);
  const navigate = useNavigate();
  const location: any = useLocation();
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
    if (location?.state?.prevPath === UPLOAD_PATH.RESULT) {
      navigate(UPLOAD_PATH.RESULT, {
        state: {
          prevPath: location.pathname,
          prevPrevPath: location?.state?.prevPath,
          updateSuccess: false,
        },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <div ref={eventTargetRef}>
        <img
          className="capture-update-img"
          src={img}
          width={window.innerWidth}
          height={window.innerWidth}
          alt="caputeImg"
        />
      </div>
      <img
        src={WhiteX}
        className="capture-category-update-page-prev-arrow"
        alt="capture-category-update-page-prev-arrow"
        aria-hidden="true"
        onClick={moveToPreviousPage}
      />
    </>
  );
}

export default UploadCertificationUpdateImg;
