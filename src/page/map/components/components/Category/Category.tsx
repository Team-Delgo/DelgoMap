import React, { useEffect, useState } from 'react';
import './Category.scss';
import cafeIcon from '../../../../../common/icons/cafe-category.svg';
import eatIcon from '../../../../../common/icons/eat-category.svg';
import walkIcon from '../../../../../common/icons/walk-category.svg';
import kinderIcon from '../../../../../common/icons/kinder-category.svg';
import beautyIcon from '../../../../../common/icons/beauty-category.svg';
import hospitalIcon from '../../../../../common/icons/hospital-category.svg';
import CategoryItem from './CategoryItem';

interface Props {
  selectedCategory: string;
  onClick: (selectedValue: string) => void;
}

const categoryList = [
  { code: 'CA0002', name: '카페', icon: cafeIcon, color: 'border-[#8e6947]' },
  { code: 'CA0003', name: '식당', icon: eatIcon, color: 'border-[#a33821]' },
  // { code: 'CA0001', name: '산책', icon: walkIcon ,color:'bg-[#4a8c48]' },
  { code: 'CA0007', name: '유치원/호텔', icon: kinderIcon, color: 'border-[#d66615]' },
  { code: 'CA0005', name: '미용/목욕', icon: beautyIcon, color: 'border-[#df3390]' },
  { code: 'CA0006', name: '병원', icon: hospitalIcon, color: 'border-[#7a5ccf]' },
];

function Categroy({ selectedCategory, onClick }: Props) {
  const [selectedValue, setSelectedValue] = useState(selectedCategory);

  useEffect(() => {
    setSelectedValue(selectedCategory);
  }, [selectedCategory]);
  const clickEventHandler = (e: React.MouseEvent<HTMLElement>) => {
    let value = e.currentTarget.getAttribute('value');

    if (value === selectedValue) {
      value = '';
      setSelectedValue('');
      onClick(value); // 부모 컴포넌트로 선택된 값을 전달
      // console.log(selectedValue);
    } else if (value) {
      setSelectedValue(value);
      onClick(value); // 부모 컴포넌트로 선택된 값을 전달
    }
  };

  return (
    <div className="absolute top-[92px] z-10 flex w-screen overflow-x-scroll scrollbar-none">
      {categoryList.map((data, i) => (
        <CategoryItem
          icon={data.icon}
          name={data.name}
          code={data.code}
          handler={clickEventHandler}
          color={data.color}
          selectedValue={selectedValue}
          isFirst={i === 0}
        />
      ))}
    </div>
  );
}
export default Categroy;
