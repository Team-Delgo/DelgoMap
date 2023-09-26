import React, { useState } from 'react';

interface Props {
  onClick: (selectedValue: string) => void;
  isBookmarkList: boolean;
}
const dropDownList1 = [
  { code: 'NEWEST', name: '최신순' },
  { code: 'OLDEST', name: '오래된순' },
  { code: 'DISTANCE', name: '거리순' },
];

const dropDownList2 = [
  { code: 'CERT', name: '방문 기록 많은순' },
  { code: 'BOOKMARK', name: '저장 많은순' },
  { code: 'DISTANCE', name: '거리순' },
];
function DropDown({ onClick, isBookmarkList }: Props) {
  const [selectedValue, setSelectedValue] = useState('DISTANCE');

  const clickEventHandler = (e: React.MouseEvent<HTMLElement>) => {
    const value = e.currentTarget.getAttribute('value');
    if (value) {
      setSelectedValue(value);
      onClick(value); // 부모 컴포넌트로 선택된 값을 전달
    }
  };

  return (
    <div className="h-screen w-screen bg-black bg-opacity-60">
      <div className="">
        {isBookmarkList
          ? dropDownList1.map((data) => (
              <div
                key={data.code}
                onClick={clickEventHandler}
                className="text-[18px] font-normal leading-[150%]"
              >
                {data.name}
                <hr />
              </div>
            ))
          : dropDownList2.map((data) => (
              <div
                key={data.code}
                onClick={clickEventHandler}
                className="text-[18px] font-normal leading-[150%]"
              >
                {data.name}
                <hr />
              </div>
            ))}
      </div>
    </div>
  );
}
export default DropDown;
