import React, { DOMAttributes, UIEventHandler } from 'react';
import './DetailTerm.scss';
import term from './TermContents';

function DetailTerm(props: { id: number }) {
  const { id } = props;
  const keyTyped = id as keyof typeof term;

  return (
    <div className="mx-[34px] my-[46px] max-h-[60vh] overflow-scroll">
      <p className="w-[63vw] text-[16px] font-bold leading-[150%] text-[#3f3f3f]">
        {term[keyTyped].main}
      </p>
      <p className="leading[150%] mt-[25px] whitespace-pre-line text-xs font-normal text-[#3f3f3f]">
        {term[keyTyped].description}
      </p>
    </div>
  );
}

export default DetailTerm;
