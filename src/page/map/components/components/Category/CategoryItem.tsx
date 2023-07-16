import React from 'react';

interface Props {
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
}: Props) {
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

export default CategoryItem;
