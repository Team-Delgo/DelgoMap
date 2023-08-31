import React from 'react';
import RecordHeader from '../components/RecordHeader';
import CertFloatingButton from '../../CertFloatingButton';
import Calender from './components/Calendar';
import PetInfo from '../components/PetInfo';

function CalendarPage() {
  return (
    <>
      <PetInfo />
      <RecordHeader />
      <Calender />
    </>
  );
}

export default CalendarPage;
