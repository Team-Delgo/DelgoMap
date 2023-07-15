import React from 'react';
import BackArrowComponent from '../../../components/BackArrowComponent';

interface Props {
  image: string;
  close: () => void;
}

function EditorNote({ image, close }: Props) {
  return (
    <div className="detail-editor">
      <BackArrowComponent onClickHandler={close} isFixed />
      <img className="w-screen" src={image} alt="editor-note" />
    </div>
  );
}

export default EditorNote;
