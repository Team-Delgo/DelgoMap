import React from 'react';
import RecordHeader from '../components/RecordHeader';
import CertFloatingButton from '../../CertFloatingButton';
import Photo from './components/Photo';
import PetInfo from '../components/PetInfo';
import FooterNavigation from 'components/FooterNavigation';

function AlbumPage() {
  return (
    <>
      <PetInfo />
      <RecordHeader />
      <Photo />
    </>
  );
}

export default AlbumPage;
