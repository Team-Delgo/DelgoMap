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

interface ListData {
  detailUrl: string;
  mungpleId: number;
  photoUrl: string;
  placeName: string;
  address: string;
  categoryCode: CategoryCode;
  certCount: number;
  bookmarkCount: number;
  isBookmarked: boolean;
}
function ListView(props: {
  lng: string;
  lat: string;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const { onClick, lng, lat } = props;
  const [selectedCategory, setSelectedCategory] = useState('CA0000');
  const [sort, setSort] = useState('DISTANCE');
  const [sortTitle, setSortTitle] = useState('거리순');
  const [showDropDown, setShowDropDown] = useState(false);
  const [isBookmarkList, setIsBookmarkList] = useState(false);
  const [listData, setListData] = useState<ListData[]>([]);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sort]);

  const fetchData = async () => {
    let res;
    try {
      if (selectedCategory === 'BOOKMARKLIST') {
        res = await getBookmark(userId, sort, lat, lng);
        setIsBookmarkList(true);
      } else res = await getMungPlaceCategory(userId, selectedCategory, sort, lat, lng);
      const { data, code } = res;
      setListData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const dropDownHandler = (selectedCode: string, selectedName: string) => {
    console.log('Selected:', selectedCode);
    setSort(selectedCode);
    setSortTitle(selectedName);
    setShowDropDown(false);
    fetchData();
  };
  const placeNameClickHandler = (mungpleId: number) => {
    navigate(`detail/${mungpleId}`);
  };
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
        {listData.map((listItem: ListData) => (
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
