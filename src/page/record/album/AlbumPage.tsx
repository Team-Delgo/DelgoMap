import React from 'react';
import RecordHeader from '../components/RecordHeader';
import CertFloatingButton from '../../CertFloatingButton';
import Photo from './components/Photo';
import PetInfo from '../components/PetInfo';

function AlbumPage() {
  return (
    <>
      <PetInfo />
      <RecordHeader />
      <Photo />
      <CertFloatingButton />
    </>
  );
}

export default AlbumPage;
