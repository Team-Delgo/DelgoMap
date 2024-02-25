import { NotificationTab } from 'common/types/notifiication';
import React from 'react';


interface Props {
  currentTab: NotificationTab;
  setCurrentTab: (tab: NotificationTab) => void;
}

function AlarmTab({ currentTab, setCurrentTab }: Props) {
  return (
    <div className="fixed top-10 flex h-10 w-full items-end font-bold">
      <p
        className={`w-1/2 cursor-pointer text-center ${
          currentTab === 'activity' ? 'text-black' : 'text-gray-600'
        }`}
        onClick={() => setCurrentTab('activity')}
      >
        <span
          className={`border-b-3 pb-1 ${
            currentTab === 'activity' ? 'border-b-4 border-black' : 'border-white'
          }`}
        >
          내 활동
        </span>
      </p>
      <p
        className={`w-1/2 cursor-pointer text-center ${
          currentTab === 'announcement' ? 'text-black' : 'text-gray-600'
        }`}
        onClick={() => setCurrentTab('announcement')}
      >
        <span
          className={`border-b-3 pb-1 ${
            currentTab === 'announcement' ? 'border-b-4 border-black' : 'border-white'
          }`}
        >
          공지사항
        </span>
      </p>
    </div>
  );
}

export default AlarmTab;
