import React from 'react';
import RecordHeader from '../components/RecordHeader';
import Photo from './components/Photo';
import PetInfo from '../components/PetInfo';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

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
