import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import CaptureCertificationImg from './components/CaptureCertificationImg';
import CaptureCertificationRecord from './components/CaptureCertificationRecord';
import './CaptureCertificationPage.scss';
import { analytics } from '../../index';
import { ROOT_PATH } from '../../common/constants/path.const';
import DeleteBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import useActive from '../../common/hooks/useActive';

function CaptureCertificationPage() {
  const [bottomSheetIsOpen, openBottomSheet,closeBottomSheet] = useActive(false);
  const [postCertificationIsLoading, onPostCertificationLoading,offPostCertificationLoading] = useActive(false);
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'CaptureCertification',
        firebase_screen_class: 'CaptureCertificationPage',
      },
    });
  }, []);

  const moveToHomePage = () => {
    navigate(ROOT_PATH);
  };

  return (
    <>
      <CaptureCertificationImg openBottomSheet={openBottomSheet} />
      <CaptureCertificationRecord
        postCertificationIsLoading={postCertificationIsLoading}
        onPostCertificationLoading={onPostCertificationLoading}
        offPostCertificationLoading={offPostCertificationLoading}
      />
      <DeleteBottomSheet
        text="작성중이던 기록이 삭제됩니다"
        description="지우면 다시 볼 수 없어요"
        cancelText="이어서 기록"
        acceptText="삭제 후 홈으로"
        acceptButtonHandler={moveToHomePage}
        cancelButtonHandler={closeBottomSheet}
        bottomSheetIsOpen={bottomSheetIsOpen}
      />
    </>
  );
}

export default CaptureCertificationPage;
