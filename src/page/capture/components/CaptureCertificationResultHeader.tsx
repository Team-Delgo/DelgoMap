/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { RootState } from '../../../redux/store';
import { CAMERA_PATH, POSTS_PATH, ROOT_PATH, RECORD_PATH } from '../../../common/constants/path.const';
import { certificationDelete } from '../../../common/api/certification';
import X from '../../../common/icons/xx.svg';
import DeleteBottomSheet from '../../../common/dialog/ConfirmBottomSheet';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { weekDay } from '../../../common/types/week';
import useActive from '../../../common/hooks/useActive';
import { useErrorHandlers } from '../../../common/api/useErrorHandlers';


interface CertificationLIkeDataType{
  userId: number;
  certificationId: number;
}

function CaptureResultHeader() {
  const [deletePostBottomSheetIsOpen, openDeletePostBottomSheet, closeDeletePostBottomSheet] = useActive(false);
  const { registDt, certificationId } = useSelector((state: RootState) => state.persist.upload);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location: any = useLocation();


  const { mutate: certificationDeleteMutate, isLoading: cettificationDeleteIsLoading } =
    useMutation((data: CertificationLIkeDataType) => certificationDelete(data), {
      onSuccess: (response: any) => {
        const { code } = response.data;

        if (code === 200) {
          moveToPhotoPage();
        }
      },
      onError: (error: any, variables, context) => {
        useErrorHandlers(dispatch, error);
      },
    });


  const deleteCertification = () => {
    if (cettificationDeleteIsLoading) return
    closeDeletePostBottomSheet();
    certificationDeleteMutate({
      userId: user?.id,
      certificationId,
    });
  };

  const moveToUpdatePage = () => {
    handleInitAchievements();
    navigate(CAMERA_PATH.UPDATE, {
      state: {
        prevPath: location.pathname,
      },
    });
  };

  const moveToHomePage = () => {
    handleInitAchievements();
    navigate(ROOT_PATH);
  };

  const moveToPostsPage = () => {
    handleInitAchievements();
    navigate(POSTS_PATH);
  };

  const moveToPhotoPage = () => {
    handleInitAchievements();
    navigate(RECORD_PATH.PHOTO);
  };


  const handleInitAchievements = () => {
    dispatch(uploadAction.initAchievements());
  };

  return (
    <>
      <header className="capture-img-result-header">
        <div className="capture-img-result-header-record-complete">????????????</div>
        <div className="capture-img-result-header-record">
          <div className="capture-img-result-header-record-date">
            {registDt.substring(0, 10)}&nbsp;{weekDay[registDt.substring(17, registDt.length)]}&nbsp;&nbsp;&nbsp;
            {registDt.substring(11, 16)}
          </div>
          <div className="capture-img-result-header-record-work">
            <div className="capture-img-result-header-record-work-modify" aria-hidden="true" onClick={moveToUpdatePage}>
              ??????&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            </div>
            <div className="capture-img-result-header-record-work-delete" aria-hidden="true" onClick={openDeletePostBottomSheet}>
              ??????
            </div>
          </div>
          <img
            src={X}
            className="capture-page-x"
            alt="capture-page-x"
            aria-hidden="true"
            onClick={
              location?.state?.prevPrevPath === POSTS_PATH
                ? moveToPostsPage
                : location?.state?.prevPrevPath === RECORD_PATH.PHOTO
                ? moveToPhotoPage
                : moveToHomePage
            }
          />
        </div>
      </header>
      <DeleteBottomSheet
        text="????????? ??????????????????????"
        description="????????? ?????? ??? ??? ?????????"
        cancelText="??????"
        acceptText="??????"
        acceptButtonHandler={deleteCertification}
        cancelButtonHandler={closeDeletePostBottomSheet}
        bottomSheetIsOpen={deletePostBottomSheetIsOpen}
      />
    </>
  );
}

export default CaptureResultHeader;
