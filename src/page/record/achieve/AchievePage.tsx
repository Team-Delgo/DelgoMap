import React, { useEffect } from 'react';
import RecordHeader from '../../../components/RecordHeader';
import AchieveContainer from './components/AchieveContainer';

function AchievePage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <RecordHeader />
      <AchieveContainer />
    </>
  );
}

export default AchievePage;
