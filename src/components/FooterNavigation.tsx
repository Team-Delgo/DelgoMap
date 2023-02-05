import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CROP_PATH, POSTS_PATH, RECORD_PATH } from "../common/constants/path.const";
import DogFoot from "../common/icons/dogfoot.svg";
import Plus from "../common/icons/plus.svg";
import { uploadAction } from "../redux/slice/uploadSlice";
import "./FooterNavigation.scss";

function FooterNavigation(){
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
    console.log(POSTS_PATH)
    navigate(POSTS_PATH);
  }


  return <div className="navigation">
    <div className="navigation-button" aria-hidden="true"  onClick={moveToPostsPage}>
      <img src={DogFoot} alt="foot"/>
      동네강아지
    </div>
    <div className="navigation-plus" aria-hidden="true" onClick={openFileGallery}>
      <img src={Plus} alt="plus" />
    </div>
    <div className="navigation-button" aria-hidden="true"  onClick={()=>{navigate(RECORD_PATH.CALENDAR)}}>
      <img src={DogFoot} alt="foot"/>
      내 기록
    </div>
    <input
        type="file"
        accept="image/jpeg,image/gif,image/png,image/jpg;capture=filesystem"
        ref={fileUploadRef}
        onChange={setPevImg}
        style={{ display: 'none' }}
      />
  </div>
};

export default FooterNavigation;