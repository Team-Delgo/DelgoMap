import React from 'react';
import ActivityMessage from './ActivityMessage';
import { Notification } from 'common/types/notifiication';
import DelgoMini from 'common/icons/delgo-mini.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

interface Props {
  activityList: Notification[];
  handleAlarmClick: (announcement: Notification) => void;
}

function ActivityList({ activityList, handleAlarmClick }: Props) {
  const { pet } = useSelector((state: RootState) => state.persist.user);
  return (
    <>
      {activityList.map((activity: Notification) => (
        <div
          key={activity.notificationId}
          className="mb-5 flex items-start"
          onClick={() => handleAlarmClick(activity)}
        >
          <img
            className="rounded-[51px]"
            width={40}
            height={40}
            src={
              !activity?.profile
                ? activity?.notificationType === 'MungpleByMe'
                  ? pet.image
                  : DelgoMini
                : activity.profile
            }
            alt="profile-img"
          />
          <div className="w-[8px]" />
          <div className="flex-1">
            <ActivityMessage message={activity.message} />
            <p className="text-xs text-gray-600">{activity.createAt.slice(0, 10)}</p>
          </div>
          <div className="w-[8px]" />
          <img width={52} height={52} src={activity.image} alt="alarm-img" />
        </div>
      ))}
    </>
  );
}

export default ActivityList;
