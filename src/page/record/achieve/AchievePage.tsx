import React, { useEffect } from 'react';
import RecordHeader from '../components/RecordHeader';
import AchieveContainer from './components/AchieveContainer';
import PetInfo from '../components/PetInfo';
function AchievePage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <PetInfo />
      <RecordHeader />
      <AchieveContainer />
    </>
  );
}

export default AchievePage;
