import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import UploadResultHeader from './components/UploadCertificationResultHeader';
import UploadResultMain from './components/UploadCertificationResultMain';
import { analytics } from '../../index';
import ToastPurpleMessage from '../../common/dialog/ToastPurpleMessage';
import useActive from '../../common/hooks/useActive';
import './UploadCertificationResultPage.scss';
import { useQueryClient } from 'react-query';

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
  const location: any = useLocation();
  const queryClient = useQueryClient();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  useEffect(() => {
    queryClient.invalidateQueries('getCertPhotos');
    queryClient.refetchQueries('getCertPhotos');
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
      <UploadResultHeader />
      <UploadResultMain />
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
