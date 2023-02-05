import React, { useState, useCallback} from 'react';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sheet from 'react-modal-sheet';
import { CAMERA_PATH } from '../../../common/constants/path.const';
import {updateCertificationPost } from '../../../common/api/certification';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import WrittingButton from '../../../common/icons/writting-button.svg';
import WrittingButtonActive from '../../../common/icons/writting-button-active.svg';
import useActive from '../../../common/hooks/useActive';
import useInput from '../../../common/hooks/useInput';


const sheetStyle = { borderRadius: '18px 18px 0px 0px' };

function CaptureCategoryUpdateRecord() {
  const { categoryKo, title, certificationId, content,address } = useSelector((state: RootState) => state.persist.upload);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const [certificationPostContent, onChangeCertificationPostContent] = useInput(content);
  const [bottomSheetIsOpen, , closeBottomSheet] = useActive(true);
  const [buttonDisabled, onButtonDisable, OffButtonDisable] = useActive(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location: any = useLocation();

  const uploadCertificationPost = () => {
    if (buttonDisabled) {
      return;
    }
    onButtonDisable();
    updateCertificationPost(
      {
        certificationId,
        description: certificationPostContent,
        userId: user.id,
      },
      (response: AxiosResponse) => {
        const { code, data } = response.data;
        if (code === 200) {
          dispatch(
            uploadAction.setContent({
              content: data.description,
              achievements: [],
            }),
          );
          moveToCaptureResultPage();
        }
      },
      dispatch,
    );
    setTimeout(() => {
      OffButtonDisable();
    }, 5000);
  };

  const moveToCaptureResultPage = useCallback(() => {
    navigate(CAMERA_PATH.RESULT, {
      state: {
        prevPath: location.pathname,
        prevPrevPath: location?.state?.prevPath,
        updateSuccess: true,
      },
    });
  }, []);

  return (
    <Sheet
      isOpen={bottomSheetIsOpen}
      onClose={closeBottomSheet}
      snapPoints={[
        window.screen.height - window.screen.width + 10,
        window.screen.height - window.screen.width + 10,
        window.screen.height - window.screen.width + 10,
        window.screen.height - window.screen.width + 10,
      ]}
      disableDrag
      className="modal-bottom-sheet"
    >
      <Sheet.Container style={sheetStyle}>
        <Sheet.Content>
          <main className="capture-img-record">
            {/* <header className="capture-img-record-container">
              <img src={categoryIcon[categoryKo]} alt="category-img" />
              <div className="capture-img-record-category">
                <div className="capture-img-record-category-label">{categoryKo}</div>
              </div>
              {certificationPostContent.length > 0 ? (
                <img
                  className="writting-button"
                  src={WrittingButtonActive}
                  alt="category-img"
                  aria-hidden="true"
                  onClick={uploadCertificationPost}
                />
              ) : (
                <img className="writting-button" src={WrittingButton} alt="category-img" />
              )}
            </header> */}
            <body className="review-container">
            <div className="review-place-info">
                  <div className="review-place-info-title">{title}</div>
                  <div className="review-place-info-address">{address}</div>
                </div>
              <textarea
                className="review-content"
                placeholder="남기고 싶은 기록을 작성해주세요"
                onChange={onChangeCertificationPostContent}
                maxLength={1000}
                value={certificationPostContent}
              />
              <div className="review-content-length">{certificationPostContent.length}/1000</div>
            </body>
            <footer>
                {certificationPostContent.length > 0 ? (
                  <div className="writting-button-active" aria-hidden="true" onClick={uploadCertificationPost}>
                    수정완료
                  </div>
                ) : (
                  <div className="writting-button">수정완료</div>
                )}
              </footer>
          </main>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

export default CaptureCategoryUpdateRecord;
