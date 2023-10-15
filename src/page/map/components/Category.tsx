import React, { useEffect, useState } from 'react';
import cafeIcon from '../../../common/icons/cafe-category.svg';
import eatIcon from '../../../common/icons/eat-category.svg';
import walkIcon from '../../../common/icons/walk-category.svg';
import kinderIcon from '../../../common/icons/kinder-category.svg';
import beautyIcon from '../../../common/icons/beauty-category.svg';
import hospitalIcon from '../../../common/icons/hospital-category.svg';
import bookmarkIcon from '../../../common/icons/bookmark.svg';
import { RootState } from 'redux/store';
import { useSelector } from 'react-redux';
import AlertConfirm from 'common/dialog/AlertConfirm';
import { useNavigate } from 'react-router-dom';
import { SIGN_IN_PATH } from 'common/constants/path.const';

interface CategoryItemProps {
  code: string;
  icon: string;
  name: string;
  handler: (e: React.MouseEvent<HTMLElement>) => void;
  isFirst: boolean;
  color: string;
  selectedValue: string;
  listView: boolean;
}

function CategoryItem({
  code,
  name,
  icon,
  handler,
  isFirst,
  color,
  selectedValue,
  listView,
}: CategoryItemProps) {
  if (listView)
    return (
      <li
        className={`${
          selectedValue === code ? color : 'border-[1px]'
        } z-10 mr-[8px] flex shrink-0 items-center rounded-[25px] border-[1.5px] bg-white pb-[3px] pl-[3px] pr-[9px] pt-[3px] text-center text-[12px] text-[#3d3d3d]`}
        key={code}
        onClick={handler}
        role="none"
        value={code}
      >
        <img src={icon} alt={name} className="categoryIcon" />
        {name}
      </li>
    );
  return (
    <li
      className={` ${
        selectedValue === code ? color : 'border-white'
      } z-10 mb-[3px] mr-[8px] flex shrink-0 items-center rounded-[25px] border-[1.5px] bg-white pb-[3px] pl-[3px] pr-[9px] pt-[3px] text-center text-[12px] text-[#3d3d3d] shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]`}
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
  onClick: (category: string) => void;
  listView: boolean;
}

const categoryList = [
  { code: 'CA0002', name: '카페', icon: cafeIcon, color: 'border-[#8e6947]' },
  { code: 'CA0003', name: '식당', icon: eatIcon, color: 'border-[#a33821]' },
  { code: 'CA0001', name: '산책', icon: walkIcon, color: 'border-[#4A8C48]' },
  { code: 'CA0007', name: '유치원/호텔', icon: kinderIcon, color: 'border-[#d66615]' },
  { code: 'CA0005', name: '미용/목욕', icon: beautyIcon, color: 'border-[#df3390]' },
  { code: 'CA0006', name: '병원', icon: hospitalIcon, color: 'border-[#7a5ccf]' },
];

function Categroy({ selectedCategory, onClick, listView }: Props) {
  const [selectedValue, setSelectedValue] = useState(selectedCategory);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  useEffect(() => {
    setSelectedValue(selectedCategory);
  }, [selectedCategory]);
  const navigate = useNavigate();
  const clickEventHandler = (e: React.MouseEvent<HTMLElement>) => {
    let value = e.currentTarget.getAttribute('value');
    if (!userId && value == 'BOOKMARK') setIsAlertOpen(true);
    else {
      if (value === selectedValue) {
        value = '';
        setSelectedValue('');
        onClick(value); // 부모 컴포넌트로 선택된 값을 전달
        console.log(value);
      } else if (value) {
        setSelectedValue(value);
        onClick(value); // 부모 컴포넌트로 선택된 값을 전달
        console.log(value);
      }
    }
  };
  const closeAlert = () => {
    setIsAlertOpen(false);
  };
  const sendLoginPage = () => {
    navigate(SIGN_IN_PATH.MAIN);
  };

  return (
    <div
      className={`${listView ? 'top-[72px]' : 'top-[92px]'}
    absolute flex w-screen overflow-x-scroll scrollbar-none`}
    >
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={sendLoginPage}
          noButtonHandler={closeAlert}
        />
      )}
      {listView ? (
        <li
          className={`ml-[18px] ${
            selectedValue === 'BOOKMARK'
              ? 'border-[1.5px] border-[#6f40f3]'
              : 'border-[1px]'
          } z-10 mr-[8px] flex shrink-0 items-center rounded-[25px] bg-white pb-[3px] pl-[3px] pr-[9px] pt-[3px] text-center text-[12px] text-[#3d3d3d]`}
          key="BOOKMARK"
          onClick={clickEventHandler}
          role="none"
          value="BOOKMARK"
        >
          <img src={bookmarkIcon} alt={'bookmark'} className="categoryIcon" />
          저장
        </li>
      ) : (
        <li
          className={` ml-[18px] ${
            selectedValue === 'BOOKMARK' ? 'border-[#6f40f3]' : 'border-white'
          } z-10 mb-[3px] mr-[8px] flex shrink-0 items-center rounded-[25px] border-[1.5px] bg-white pb-[3px] pl-[3px] pr-[9px] pt-[3px] text-center text-[12px] text-[#3d3d3d] shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]`}
          key="BOOKMARK"
          onClick={clickEventHandler}
          role="none"
          value="BOOKMARK"
        >
          <img src={bookmarkIcon} alt={'bookmark'} className="categoryIcon" />
          저장
        </li>
      )}
      {categoryList.map((data, i) => (
        <CategoryItem
          listView={listView}
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
