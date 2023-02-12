import React, {useRef} from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CROP_PATH } from "../common/constants/path.const";
import Plus from "../common/icons/plus.svg";
import { uploadAction } from "../redux/slice/uploadSlice";
import "./CertFloatingButton.scss";

function CertFloatingButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  const certButtonHandler = () => {
      openFileGallery();;
  };

  return (
    <div className="cert-floating-button" aria-hidden onClick={certButtonHandler}>
      <img src={Plus} alt="floating-button" />
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

export default CertFloatingButton;
