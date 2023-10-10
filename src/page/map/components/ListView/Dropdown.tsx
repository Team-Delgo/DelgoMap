import React, { useState } from 'react';

interface Props {
  onClick: (selectedCode: string, selectedName: string) => void;
  isBookmarkList: boolean;
  sortCode: string;
}
const dropDownList1 = [
  { code: 'NEWEST', name: '최신순' },
  { code: 'OLDEST', name: '오래된순' },
  { code: 'DISTANCE', name: '거리순' },
];

const dropDownList2 = [
  { code: 'DISTANCE', name: '거리순' },
  { code: 'CERT', name: '방문 기록 많은순' },
  { code: 'BOOKMARK', name: '저장 많은순' },
];
function DropDown({ onClick, isBookmarkList, sortCode }: Props) {
  const clickEventHandler = (e: React.MouseEvent<HTMLElement>) => {
    const value1 = e.currentTarget.getAttribute('data-code');
    const value2 = e.currentTarget.getAttribute('data-name');

    if (value1 && value2) {
      onClick(value1, value2); // 부모 컴포넌트로 선택된 값을 전달
    }
  };

  return (
    <div className="fixed z-[999] h-screen w-screen bg-black bg-opacity-60">
      <div className="absolute bottom-0 h-[228px] w-screen rounded-t-[19px] bg-white">
        {isBookmarkList
          ? dropDownList1.map((data) => (
              <div>
                <li
                  key={data.code}
                  data-code={data.code}
                  data-name={data.name}
                  onClick={clickEventHandler}
                  className={`my-[16px] list-none text-center text-[18px] leading-[150%] ${
                    data.code === sortCode ? 'font-bold' : 'font-normal text-[#646566]'
                  }`}
                >
                  {data.name}
                </li>
                {data.code != 'DISTANCE' && <hr />}
              </div>
            ))
          : dropDownList2.map((data) => (
              <div>
                <li
                  key={data.code}
                  data-code={data.code}
                  data-name={data.name}
                  onClick={clickEventHandler}
                  className={`my-[16px] list-none text-center text-[18px] leading-[150%] ${
                    data.code === sortCode ? 'font-bold' : 'font-normal text-[#646566]'
                  }`}
                >
                  {data.name}
                </li>
                {data.code != 'BOOKMARK' && <hr />}
              </div>
            ))}
      </div>
    </div>
  );
}
export default DropDown;
