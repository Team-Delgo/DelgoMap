import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

function UploadResultMain() {
  const { img, title, content, address, isHideAddress } = useSelector(
    (state: RootState) => state.persist.upload,
  );

  //업로드 결과 컴포넌트

  return (
    <main className="capture-img-result-main">
      <img className="capture-img" src={img} alt="caputeImg" />
      <header className="capture-img-result-main-header">
        <div className="capture-img-result-main-header-place">
          <div className="capture-img-result-main-header-place-name">{title}</div>
          {!isHideAddress && (
            <div className="capture-img-result-main-header-place-address">{address}</div>
          )}
        </div>
      </header>
      <body className="capture-img-result-main-body">{content}</body>
    </main>
  );
}

export default UploadResultMain;
