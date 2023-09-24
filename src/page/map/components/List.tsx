import React, { useState } from 'react';
import Categroy from './Category';
import listIcon from '../../../common/icons/list.svg';
import arrow from '../../../common/icons/prev-arrow-black.svg';
function ListView(props: { onClick: (event: React.MouseEvent<HTMLDivElement>) => void }) {
  const { onClick } = props;
  const [selectedCategory, setSelectedCategory] = useState('');
  return (
    <div className="z-[999] h-screen w-screen bg-white">
      <div className="fixed mt-[16px] w-screen">
        <img
          src={arrow}
          className="absolute ml-[22px] mt-[3px] h-[17px] w-[18px]"
          onClick={onClick}
        />
        <div className="absolute left-[50%] -translate-x-[50%] text-[18px] font-normal leading-[150%]">
          목록으로 보기
        </div>
      </div>
      <Categroy
        selectedCategory={selectedCategory}
        onClick={(category) => {
          setSelectedCategory(category);
        }}
      />
    </div>
  );
}
export default ListView;
