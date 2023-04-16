import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useErrorHandlers } from '../../common/api/useErrorHandlers';
import VerticalDevider from '../../common/icons/vertical-devide.svg';
import Heart from '../../common/icons/heart-empty.svg';
import FillHeart from '../../common/icons/heart.svg';
import Comments from '../../common/icons/comments.svg';
import { Cert } from '../../common/types/map';
import './RecordCertification.scss';
import {
  certificationLike,
  certificationDelete,
} from '../../common/api/certification';
import { uploadAction } from '../../redux/slice/uploadSlice';
import { CAMERA_PATH, RECORD_PATH } from '../../common/constants/path.const';
import { RootState } from '../../redux/store';
import DeleteBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import { categoryCode2 } from '../../common/types/category';
import useActive from '../../common/hooks/useActive';

interface CertificationLIkeDataType {
  userId: number;
  certificationId: number;
}

function RecordCertification(props: { certification: Cert }) {
  const { certification } = props;
  const dispatch = useDispatch();
  const [selfHeart, setSelfHeart] = useState(certification.isLike);
  const [count, setCount] = useState(certification.likeCount);
  const [deleteBottomSheetIsOpen, openDeleteBottomSheet, closeDeleteBottomSheet] =
    useActive(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.persist.user);

  const { mutate: certificationLikeMutate } = useMutation(
    (data: CertificationLIkeDataType) => certificationLike(data),
    {
      onSuccess: () => {
        setSelfHeart(!selfHeart);
        setCount(selfHeart ? count - 1 : count + 1);
      },
      onError: (error: any, variables, context) => {
        useErrorHandlers(dispatch, error);
      },
    },
  );

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

  const deleteCertification = useCallback(() => {
    if (cettificationDeleteIsLoading) {
      return;
    }
    closeDeleteBottomSheet();
    certificationDeleteMutate({
      userId: user?.id,
      certificationId: certification.certificationId,
    });
  }, []);

  const moveToPhotoPage = useCallback(() => {
    navigate(RECORD_PATH.PHOTO);
  }, []);

  const moveToUpdatePage = useCallback(() => {
    dispatch(
      uploadAction.setCertificationUpdate({
        img: certification?.photoUrl,
        categoryKo: categoryCode2[certification?.categoryCode],
        title: certification?.placeName,
        certificationId: certification?.certificationId,
        content: certification?.description,
      }),
    );
    navigate(CAMERA_PATH.UPDATE, {
      state: {
        prevPath: RECORD_PATH.PHOTO,
      },
    });
  }, []);

  return (
    <>
      <div className="record-cert">
        <div className="record-cert-edit">
          <div aria-hidden="true" onClick={moveToUpdatePage}>
            수정
          </div>
          <img src={VerticalDevider} alt="devider" />
          <div aria-hidden="true" onClick={openDeleteBottomSheet}>
            삭제
          </div>
        </div>
        <img
          className="record-cert-img"
          src={certification.photoUrl}
          alt={certification.placeName}
        />
        <div className="record-cert-main">
          <div className="record-cert-main-text">
            <div className="record-cert-main-text-title">{certification.placeName}</div>
            <div className="record-cert-main-text-sub">{certification.address}</div>
          </div>
        </div>
        <div className="record-cert-devider" />
        <div className="record-cert-description">{certification.description}</div>
        <div className="record-cert-icons">
          <img
            className="record-cert-icons-heart"
            src={selfHeart ? FillHeart : Heart}
            alt="heart"
            aria-hidden="true"
            onClick={() =>
              certificationLikeMutate({
                userId: certification.userId,
                certificationId: certification.certificationId,
              })
            }
          />
          {count > 0 && <div className="record-cert-icons-count">{count}</div>}
          <img
            className="record-cert-icons-comments"
            src={Comments}
            alt="comments"
            aria-hidden="true"
            onClick={() => {
              navigate(`/comments/${certification.certificationId}`, {
                state: { post: certification },
              });
            }}
          />
          {certification.commentCount > 0 && (
            <div className="record-cert-icons-count">{certification.commentCount}</div>
          )}
        </div>
      </div>
      <DeleteBottomSheet
        text="기록을 삭제하실건가요?"
        description="지우면 다시 볼 수 없어요"
        cancelText="취소"
        acceptText="삭제"
        acceptButtonHandler={deleteCertification}
        cancelButtonHandler={closeDeleteBottomSheet}
        bottomSheetIsOpen={deleteBottomSheetIsOpen}
      />
    </>
  );
}

export default RecordCertification;
