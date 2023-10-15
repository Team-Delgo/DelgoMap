import React, { useState, useEffect } from 'react';
import Categroy from '../Category';
import { useNavigate } from 'react-router-dom';
import { getBookmark, getMungPlaceCategory } from 'common/api/certification';
import DropDown from './Dropdown';
import arrow from '../../../../common/icons/prev-arrow-black.svg';
import dogfoot from '../../../../common/icons/dogfoot-small-black.svg';
import dropDownArrow from '../../../../common/icons/dropdown.svg';
import emptystar from '../../../../common/icons/emptystar.svg';
import star from '../../../../common/icons/star.svg';
import dot from '../../../../common/icons/dot.svg';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { CategoryCode } from '../../index.types';
import { categoryCode } from 'common/types/category';

function ListView(props: {
  lng: string;
  lat: string;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const { onClick, lng, lat } = props;
  const [selectedCategory, setSelectedCategory] = useState('CA0000');
  const [isBookmarkList, setIsBookmarkList] = useState(false);
  const [sort, setSort] = useState('DISTANCE');
  const [sortTitle, setSortTitle] = useState('거리순');
  const [showDropDown, setShowDropDown] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const navigate = useNavigate();

  const { data: notBookmarkedData } = useQuery(
    ['getnotBookmarkedData', userId, sort, selectedCategory, lat, lng],
    () => getMungPlaceCategory(userId, selectedCategory, sort, lat, lng),
    {
      onSuccess: () => {
        setIsBookmarkList(false);
      },
      enabled: selectedCategory !== 'BOOKMARK',
    },
  );

  const { data: bookMarkedData } = useQuery(
    ['getBookMarkedData', userId, sort, selectedCategory, lat, lng],
    () => getBookmark(userId, sort, lat, lng),
    {
      onSuccess: () => {
        setIsBookmarkList(true);
      },
      enabled: selectedCategory === 'BOOKMARK',
    },
  );

  const dropDownHandler = (selectedCode: string, selectedName: string) => {
    setSort(selectedCode);
    console.log('Selected:', selectedCode);
    setSortTitle(selectedName);
    setShowDropDown(false);
  };
  const placeNameClickHandler = (mungpleId: number) => {
    navigate(`detail/${mungpleId}`);
  };
  const listData = selectedCategory === 'BOOKMARK' ? bookMarkedData : notBookmarkedData;
  return (
    <div className="z-[999] h-screen w-screen bg-white">
      {showDropDown && (
        <DropDown
          onClick={dropDownHandler}
          isBookmarkList={isBookmarkList}
          sortCode={sort}
        />
      )}
      <div className="fixed mt-[16px] w-screen ">
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
          setSelectedCategory(category || 'CA0000');
          if (category === 'BOOKMARK') {
            setSort('NEWEST');
            setSortTitle('최신순');
          } else if (isBookmarkList && category != 'BOOKMARK') {
            setSort('DISTANCE');
            setSortTitle('거리순');
          }
        }}
        listView={true}
      />
      <div
        className="absolute left-[20px] top-[125px] flex"
        onClick={() => {
          setShowDropDown((prevState) => !prevState);
        }}
      >
        {sortTitle}
        <img src={dropDownArrow} className="ml-[4px]" />
      </div>
      <div className="ml-[20px] mt-[158px] h-[100vh] overflow-y-scroll pb-[158px] scrollbar-none">
        {listData?.map((listItem) => (
          <div key={listItem.mungpleId} className="mb-[14px] flex">
            <img src={listItem.photoUrl} className="h-[88px] w-[88px] rounded-[6px]" />
            <div className="ml-[13px] max-h-[100%]">
              <div
                className="flex items-center text-[16px] font-semibold"
                onClick={() => placeNameClickHandler(listItem.mungpleId)}
              >
                {listItem.placeName}
              </div>
              <div className="mr-[20px] text-[12px] text-[#8a8a8a]">
                {listItem.address}
              </div>
              <div className="flex">
                <img src={dogfoot} />
                <div className="ml-[4px] text-[12px] font-medium leading-[150%]">
                  {listItem.certCount}
                </div>
                <img className="mx-[6px]" src={dot} />
                {listItem.isBookmarked ? <img src={star} /> : <img src={emptystar} />}
                <div className="ml-[4px] text-[12px] font-medium leading-[150%]">
                  {listItem.bookmarkCount}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ListView;
