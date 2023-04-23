import React, { useEffect } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useNavigate } from 'react-router-dom';
import CaptureCertificationImg from './components/CaptureCertificationImg';
import CaptureLocationRecord from './components/CaptureLocationRecord';
import './CaptureLocationPage.scss';
import { analytics } from '../../index';
import DeleteBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import { ROOT_PATH } from '../../common/constants/path.const';
import useActive from '../../common/hooks/useActive';

function CaptureLocationPage() {
  const [bottomSheetIsOpen, openBottomSheet, closeBottomSheet] = useActive(false);
  const navigate = useNavigate();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  useEffect(() => {
    window.localStorage.setItem('isFirstCert', "true");
    mutation.mutate({
      params: {
        firebase_screen: 'CaptureLocation',
        firebase_screen_class: 'CaptureLocationPage',
      },
    });
  }, []);

  const moveToHomePage = () => {
    navigate(ROOT_PATH);
  };

  return (
    <>
      <CaptureCertificationImg openBottomSheet={openBottomSheet} />
      <CaptureLocationRecord />
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

export default CaptureLocationPage;
