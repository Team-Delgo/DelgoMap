import React, { useEffect, useState } from 'react';
import './Category.scss';
import cafeIcon from '../../../common/icons/cafe-category.svg';
import eatIcon from '../../../common/icons/eat-category.svg';
import walkIcon from '../../../common/icons/walk-category.svg';
import kinderIcon from '../../../common/icons/kinder-category.svg';
import beautyIcon from '../../../common/icons/beauty-category.svg';
import hospitalIcon from '../../../common/icons/hospital-category.svg';

interface Props {
  selectedCategory: string;
  onClick: (selectedValue: string) => void;
}

console.log('test');

const categoryList = [
  { code: 'CA0002', name: '카페', icon: cafeIcon },
  // { code: 'CA0003', name: '식당', icon: eatIcon },
  // { code: 'CA0001', name: '산책', icon: walkIcon },
  { code: 'CA0007', name: '유치원/호텔', icon: kinderIcon },
  { code: 'CA0005', name: '미용/목욕', icon: beautyIcon },
  { code: 'CA0006', name: '병원', icon: hospitalIcon },
];

function Categroy({ selectedCategory, onClick }: Props) {
  const [selectedValue, setSelectedValue] = useState(selectedCategory);

  console.log(selectedValue);

  useEffect(()=>{
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
    <div className="category">
      {categoryList.map((data) => (
        <li
          className={`categoryList${data.code === selectedValue ? ' active' : ''}`}
          key={data.code}
          onClick={clickEventHandler}
          role="none"
          value={data.code}
        >
          <img src={data.icon} alt={data.name} className="categoryIcon" />
          {data.name}
        </li>
      ))}
    </div>
  );
}
export default Categroy;
