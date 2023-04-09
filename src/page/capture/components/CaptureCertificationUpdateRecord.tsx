import React, { useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CAMERA_PATH } from '../../../common/constants/path.const';
import { updateCertificationPost } from '../../../common/api/certification';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import useActive from '../../../common/hooks/useActive';
import useInput from '../../../common/hooks/useInput';
import BallLoading from '../../../common/utils/BallLoading';

function CaptureCategoryUpdateRecord() {
  const { title, certificationId, content, address } = useSelector(
    (state: RootState) => state.persist.upload,
  );
  const { user } = useSelector((state: RootState) => state.persist.user);
  const [certificationPostContent, onChangeCertificationPostContent] = useInput(content);
  const [buttonDisabled, onButtonDisable, OffButtonDisable] = useActive(false);
  const [
    updateCertificationIsLoading,
    onUpdateCertificationLoading,
    offUpdateCertificationLoading,
  ] = useActive(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location: any = useLocation();

  const uploadCertificationPost = () => {
    if (buttonDisabled || updateCertificationIsLoading) {
      return;
    }
    onUpdateCertificationLoading();
    onButtonDisable();

    setTimeout(() => {
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
          } else {
            offUpdateCertificationLoading();
            OffButtonDisable();
          }
        },
        dispatch,
      );
    }, 1000);
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

  const screenUp = ()=>{
    window.webkit.messageHandlers.NAME.postMessage("screenUp")
  }

  return (
    <>
      {updateCertificationIsLoading && <BallLoading />}
      <main
        className="capture-img-record"
        style={{
          height: `calc(100% - ${window.innerWidth}px + 20vw)`,
        }}
      >
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
            onFocus={screenUp}
          >
            {certificationPostContent}
          </textarea>
          <div className="review-content-length">
            {certificationPostContent.length}/1000
          </div>
        </body>
        <footer>
          {certificationPostContent.length > 0 ? (
            <div
              className="writting-button-active"
              aria-hidden="true"
              onClick={uploadCertificationPost}
            >
              수정완료
            </div>
          ) : (
            <div className="writting-button">수정완료</div>
          )}
        </footer>
      </main>
    </>
  );
}

export default CaptureCategoryUpdateRecord;
