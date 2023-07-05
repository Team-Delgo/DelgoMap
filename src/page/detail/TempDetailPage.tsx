import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import './TempDetailPage.scss';
import BackArrowComponent from '../../components/BackArrowComponent';

function TempDetailPage() {
  const image = useSelector((state: RootState) => state.map.detailImgUrl);
  const navigate = useNavigate();

  return (
    <div>
      <BackArrowComponent onClickHandler={() => navigate(-1)} isFixed white />
      <img className="temp-detail" src={image} alt="editor-note" />
    </div>
  );
}

export default TempDetailPage;
