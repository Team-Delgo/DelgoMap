import React, { useCallback, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import Link from '../../../common/icons/dogfoot.svg';
import { analytics } from '../../../index';
import './LinkCopy.scss';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { CROP_PATH } from '../../../common/constants/path.const';


function LinkCopy(props: { setLoading: (loading: boolean) => void; isMungple: boolean }) {
  const { setLoading, isMungple } = props;
  const linkCopyEvent = useAnalyticsCustomLogEvent(analytics, 'link_copy');
  const url = useSelector((state: RootState) => state.map.link);
  const dogName = useSelector((state: RootState) => state.persist.user.pet.name);
  const selectedMungple = useSelector((state: RootState) => state.map.selectedId);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openFileGallery = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const sendScrap = async () => {
    setLoading(true);
    await window.Kakao.Share.sendScrap({
      requestUrl: url,
      templateId: 92943,
    });
    setLoading(false);
  };

  const buttonClickHandler = () => {
    console.log(selectedMungple);
  };

  const setCertLocation = (event: { target: HTMLInputElement }) => {
    if (event.target.files) {
      const galleryImg = URL.createObjectURL(event.target.files[0]);
      const galleryImgName = event.target.files[0].name;
      dispatch(
        uploadAction.setHomeCert({
          prevImg: galleryImg,
          prevImgName: galleryImgName,
          latitude:  selectedMungple.lat,
          longitude: selectedMungple.lng,
        }),
      );
      navigate(CROP_PATH, { state: { prevPath: 'homeMap' } });
    }
  };

  return (
    <div
      className={classNames('link', { isMungple })}
      aria-hidden="true"
      onClick={buttonClickHandler}
    >
      <img src={Link} alt="link" />
      <div className="link-text" aria-hidden="true" onClick={openFileGallery}>
        이곳에{` ${dogName}`} 발자국 남기기
      </div>
      <input
        type="file"
        accept="image/jpeg,image/gif,image/png,image/jpg;capture=filesystem"
        ref={fileUploadRef}
        onChange={setCertLocation}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default LinkCopy;
