import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import CaptureResultHeader from './components/CaptureCertificationResultHeader';
import CaptureResultMain from './components/CaptureCertificationResultMain';
import { analytics } from '../../index';
import ToastPurpleMessage from '../../common/dialog/ToastPurpleMessage';
import { RootState } from '../../redux/store';
import AchievementBottomSheet from '../../common/dialog/AchievementBottomSheet';
import useActive from '../../common/hooks/useActive';
import './CaptureCertificationResultPage.scss';

function CaptureResult() {
  const [
    certificateSuccessToastIsOpen,
    onCertificateSuccessToast,
    closeCertificateSuccessToast,
  ] = useActive(false);
  const [
    certificateUpdateSuccessToastIsOpen,
    onCertificateUpdateSuccessToast,
    offCertificateUpdateSuccessToast,
  ] = useActive(false);
  const [
    achievementBottomSheetIsOpen1,
    openAchievementBottomSheet1,
    closeAchievementBottomSheet1,
  ] = useActive(false);
  const [
    achievementBottomSheetIsOpen2,
    openAchievementBottomSheet2,
    closeAchievementBottomSheet2,
  ] = useActive(false);

  
  // const { achievements } = useSelector((state: RootState) => state.persist.upload);
  const location: any = useLocation();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  // useEffect(() => {
  //   if (achievements.length === 1) {
  //     openAchievementBottomSheet1();
  //   } else if (achievements.length === 2) {
  //     openAchievementBottomSheet1();
  //     openAchievementBottomSheet2();
  //   }
  // }, []);

  useEffect(() => {
    if (location?.state?.prevPath?.includes('update')) {
      if (location?.state?.updateSuccess) {
        onCertificateUpdateSuccessToast();
        setTimeout(() => {
          offCertificateUpdateSuccessToast();
        }, 2000);
      }
    } else {
      onCertificateSuccessToast();
      setTimeout(() => {
        closeCertificateSuccessToast();
      }, 2000);
    }
  }, []);

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'CaptureResult',
        firebase_screen_class: 'CaptureResultPage',
      },
    });
  }, []);

  return (
    <>
      <CaptureResultHeader />
      <CaptureResultMain />
      {/* <AchievementBottomSheet
        text="업적 획득"
        achievement={achievements[0]}
        allView
        cancelButtonHandler={closeAchievementBottomSheet1}
        bottomSheetIsOpen={achievementBottomSheetIsOpen1}
      />
      <AchievementBottomSheet
        text="업적 획득"
        achievement={achievements[1]}
        allView
        cancelButtonHandler={closeAchievementBottomSheet2}
        bottomSheetIsOpen={achievementBottomSheetIsOpen2}
      /> */}
      {certificateSuccessToastIsOpen && (
        <ToastPurpleMessage message="인증에 성공하였습니다" />
      )}
      {certificateUpdateSuccessToastIsOpen && (
        <ToastPurpleMessage message="인증 수정에 성공하였습니다" />
      )}
    </>
  );
}

export default CaptureResult;
