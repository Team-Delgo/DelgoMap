import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

function CaptureResultMain() {
  const { img, title, content, address } = useSelector((state: RootState) => state.persist.upload);


  console.log('content',content)

  return (
    <main className="capture-img-result-main">
      <img className="capture-img" src={img} alt="caputeImg" />
      <header className="capture-img-result-main-header">
        <div className="capture-img-result-main-header-place">
          <div className="capture-img-result-main-header-place-name">{title}</div>
          <div className="capture-img-result-main-header-place-address">{address}</div>
        </div>
      </header>
      <body className="capture-img-result-main-body">{content}</body>
    </main>
  );
}

export default CaptureResultMain;
