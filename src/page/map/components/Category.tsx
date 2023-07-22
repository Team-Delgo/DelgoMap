import React, { useEffect, useState } from 'react';
import './Category.scss';
import cafeIcon from '../../../common/icons/cafe-category.svg';
import eatIcon from '../../../common/icons/eat-category.svg';
import walkIcon from '../../../common/icons/walk-category.svg';
import kinderIcon from '../../../common/icons/kinder-category.svg';
import beautyIcon from '../../../common/icons/beauty-category.svg';
import hospitalIcon from '../../../common/icons/hospital-category.svg';

interface CategoryItemProps {
  code: string;
  icon: string;
  name: string;
  handler: (e: React.MouseEvent<HTMLElement>) => void;
  isFirst: boolean;
  color: string;
  selectedValue: string;
}

function CategoryItem({
  code,
  name,
  icon,
  handler,
  isFirst,
  color,
  selectedValue,
}: CategoryItemProps) {
  return (
    <li
      className={`${isFirst && 'ml-[18px]'} ${
        selectedValue === code && color
      } z-10 mr-[8px] flex shrink-0 items-center rounded-[25px] border  border-white bg-white pb-[3px] pl-[3px] pr-[9px] pt-[3px] text-center text-[12px] text-[#3d3d3d]`}
      // className={`categoryList${data.code === selectedValue ? ' active' : ''}`}
      key={code}
      onClick={handler}
      role="none"
      value={code}
    >
      <img src={icon} alt={name} className="categoryIcon" />
      {name}
    </li>
  );
}

interface Props {
  selectedCategory: string;
  onClick: (selectedValue: string) => void;
}

const categoryList = [
  { code: 'CA0002', name: '카페', icon: cafeIcon, color: '#8e6947' },
  { code: 'CA0003', name: '식당', icon: eatIcon, color: '#a33821' },
  // { code: 'CA0001', name: '산책', icon: walkIcon },
  { code: 'CA0007', name: '유치원/호텔', icon: kinderIcon, color: '#d66615' },
  { code: 'CA0005', name: '미용/목욕', icon: beautyIcon, color: '#df3390' },
  { code: 'CA0006', name: '병원', icon: hospitalIcon, color: '#7a5ccf' },
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
    } else if (value) {
      setSelectedValue(value);
      onClick(value); // 부모 컴포넌트로 선택된 값을 전달
    }
  };

  return (
    <div className="absolute top-[92px] flex w-screen overflow-x-scroll scrollbar-none">
      {categoryList.map((data, i) => (
        <CategoryItem
          code={data.code}
          name={data.name}
          icon={data.icon}
          handler={clickEventHandler}
          isFirst={i === 0}
          selectedValue={selectedValue}
          color={data.color}
        />
      ))}
    </div>
  );
}
export default Categroy;
