import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import Link from '../../../common/icons/dogfoot.svg';
import { analytics } from '../../../index';
import './LinkCopy.scss';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { CAMERA_PATH, CROP_PATH } from '../../../common/constants/path.const';


function LinkCopy(props: { redirect: (signin: boolean) => void, setLoading: (loading: boolean) => void; isMungple: boolean }) {
  const { setLoading, isMungple, redirect } = props;
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const linkCopyEvent = useAnalyticsCustomLogEvent(analytics, 'link_copy');
  const url = useSelector((state: RootState) => state.map.link);
  const dogName = useSelector((state: RootState) => state.persist.user.pet.name);
  const selectedMungple = useSelector((state: RootState) => state.map.selectedId);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const setCertLocation = () => {
    console.log('selectedMungple',selectedMungple)
    
    dispatch(
      uploadAction.setHomeCert({
        // prevImg: galleryImg,
        // prevImgName: galleryImgName,
        latitude: selectedMungple.lat,
        longitude: selectedMungple.lng,
        mongPlaceId: selectedMungple.id,
        title: selectedMungple.title,
        address: selectedMungple.address,
        categoryCode:selectedMungple.categoryCode
      }),
    );
    navigate(CAMERA_PATH.CERTIFICATION, { state: { prevPath: 'homeMap' } });
  };

  return (
    <div
      className={classNames('link', { isMungple })}
      aria-hidden="true"
      onClick={buttonClickHandler}
    >
      <img src={Link} alt="link" />
      <div className="link-text" aria-hidden="true" onClick={setCertLocation}>
        이곳에{` ${dogName}`} 발자국 남기기
      </div>
    </div>
  );
}

export default LinkCopy;
