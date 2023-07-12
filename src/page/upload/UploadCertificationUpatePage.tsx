import React, { useEffect } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import UploadCertificationUpdateImg from './components/UploadCertificationUpdateImg';
import UploadCertificationUpdateRecord from './components/UploadCertificationUpdateRecord';
import './UploadCertificationUpatePage.scss';
import { analytics } from '../../index';

function CaptureCertificationUpatePage() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'CaptureCertificationUpdate',
        firebase_screen_class: 'CaptureCertificationUpdatePage',
      },
    });
  },[]);

  return (
    <>
      <UploadCertificationUpdateImg />
      <UploadCertificationUpdateRecord />
    </>
  );
}

export default CaptureCertificationUpatePage;
