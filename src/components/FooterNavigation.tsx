import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CROP_PATH, RECORD_PATH, SIGN_IN_PATH, POSTS_PATH } from '../common/constants/path.const';
import AlertConfirm from '../common/dialog/AlertConfirm';
import DogFoot from '../common/icons/dogfoot.svg';
import Home from "../common/icons/home.svg";
import Plus from '../common/icons/plus.svg';
import { uploadAction } from '../redux/slice/uploadSlice';
import { RootState } from '../redux/store';
import './FooterNavigation.scss';

function FooterNavigation(props: { setCenter: () => void }) {
  const { setCenter } = props;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const device = useSelector((state: RootState) => state.persist.device.OS);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const openFileGallery = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const setPevImg = (event: { target: HTMLInputElement }) => {
    if (event.target.files) {
      const galleryImg = URL.createObjectURL(event.target.files[0]);
      const galleryImgName = event.target.files[0].name;
      dispatch(uploadAction.setPrevImg({ prevImg: galleryImg, prevImgName: galleryImgName }));
      navigate(CROP_PATH, { state: { prevPath: location.pathname } });
    }
  };

  const moveToPostsPage = () => {
    setCenter();
    navigate(POSTS_PATH , {state:{cert:null, from:'home'}});
  };
  const sendLoginPage = () => {
    navigate(SIGN_IN_PATH.MAIN);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  const recordButtonHandler = () => {
    if (userId) {
      setCenter();
      navigate(RECORD_PATH.PHOTO);
    } else setIsAlertOpen(true);
  };

  const certButtonHandler = () => {
    if (userId) {
      setCenter();
      openFileGallery();
    } else setIsAlertOpen(true);
  };

  return (
    <div className={classNames("navigation", {ios:device==="ios"})}>
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={sendLoginPage}
          noButtonHandler={closeAlert}
        />
      )}
      <div className="navigation-button" aria-hidden="true" onClick={moveToPostsPage}>
        <img src={Home} alt="home" />
        동네강아지
      </div>
      <div className="navigation-plus" aria-hidden="true" onClick={certButtonHandler}>
        <img src={Plus} alt="plus" />
      </div>
      <div className="navigation-button" aria-hidden="true" onClick={recordButtonHandler}>
        <img src={DogFoot} alt="foot" />내 기록
      </div>
      <input
        type="file"
        accept="image/jpeg,image/gif,image/png,image/jpg;capture=filesystem"
        ref={fileUploadRef}
        onChange={setPevImg}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default FooterNavigation;
