import React, { useEffect } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useDispatch } from 'react-redux';
import CaptureImgRecord from './components/CaptureImgRecord';
import CaptureImg from './components/CaptureImg';
import { uploadAction } from '../../redux/slice/uploadSlice';
import './CapturePage.scss';
import { analytics } from '../../index';

function CapturePage() {
  const dispatch = useDispatch();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'Capture',
        firebase_screen_class: 'CapturePage',
      },
    });
  }, []);

  return (
    <>
      <CaptureImg />
      <CaptureImgRecord />
    </>
  );
}

export default CapturePage;
