import React, { useEffect } from 'react';
import RecordHeader from '../components/RecordHeader';
import PetInfo from '../components/PetInfo';
import ActivityWrapper from './components/ActivityWrapper'

function AchievePage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <PetInfo />
      <RecordHeader />
      <ActivityWrapper/>
    </>
  );
}

export default AchievePage;
