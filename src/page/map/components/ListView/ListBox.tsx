import React from 'react';
import { useState } from 'react';
import listIcon from '../../../../common/icons/list.svg';
import ListView from './List';
function ListBox(props: { lng: string; lat: string }) {
  const { lng, lat } = props;
  const [isSearchViewOpen, setIsSearchViewOpen] = useState(false);
  const openListView = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsSearchViewOpen(true);
  };
  const closeListView = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsSearchViewOpen(false);
  };
  return (
    <div className="flex w-screen justify-center">
      {isSearchViewOpen && <ListView onClick={closeListView} lat={lat} lng={lng} />}
      {!isSearchViewOpen && (
        <div
          className="absolute bottom-[90px] z-[100] flex items-center rounded-[45px] bg-[#FFF] px-[15px] py-[8px] shadow-1"
          onClick={openListView}
        >
          <img src={listIcon} />
          <span className="ml-[6px] text-[13px] font-medium leading-[150%]">
            목록으로 보기
          </span>
        </div>
      )}
    </div>
  );
}
export default ListBox;
