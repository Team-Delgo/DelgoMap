import React from 'react';
import ActivityMessage from './ActivityMessage';
import BathSmall from 'common/icons/bath-map.svg';
import CafeSmall from 'common/icons/cafe-category.svg';
import BeautySmall from 'common/icons/beauty-category.svg';
import WalkSmall from 'common/icons/walk-category.svg';
import KinderSmall from 'common/icons/kinder-category.svg';
import HospitalSmall from 'common/icons/hospital-mint-small.svg';
import EatSmall from 'common/icons/eat-category.svg';
import EtcSmall from 'common/icons/etc-small.svg';
import { Notification } from 'common/types/notifiication';
import DelgoMini from 'common/icons/delgo-mini.svg';

interface Props {
  announcementList: Notification[];
  handleAlarmClick: (announcement: Notification) => void;
}

type CategoryCode =
  | 'CA0001'
  | 'CA0002'
  | 'CA0003'
  | 'CA0004'
  | 'CA0005'
  | 'CA0006'
  | 'CA0007'
  | 'CA9999';

function AnnouncementList({ announcementList, handleAlarmClick }: Props) {
  const getCategoryIcon = (categoryCode: CategoryCode) => {
    switch (categoryCode) {
      case 'CA0001':
        return WalkSmall;
      case 'CA0002':
        return CafeSmall;
      case 'CA0003':
        return EatSmall;
      case 'CA0004':
        return BathSmall;
      case 'CA0005':
        return BeautySmall;
      case 'CA0006':
        return HospitalSmall;
      case 'CA0007':
        return KinderSmall;
      case 'CA9999':
        return EtcSmall;
      default:
        return EtcSmall;
    }
  };

  return (
    <>
      {announcementList.map((announcement: Notification) => (
        <div
          key={announcement.objectId}
          className="mb-5 flex items-start"
          onClick={() => handleAlarmClick(announcement)}
        >
          <img
            className="rounded-[51px]"
            width={40}
            height={40}
            src={getCategoryIcon(
              !announcement?.categoryCode ? DelgoMini : announcement?.categoryCode,
            )}
            alt="profile-img"
          />
          <div className="w-[8px]" />
          <div className="flex-1">
            <ActivityMessage message={announcement.message} />
            <p className="text-xs text-gray-600">{announcement.createAt.slice(0, 10)}</p>
          </div>
          <div className="w-[8px]" />
          <img width={52} height={52} src={announcement.image} alt="alarm-img" />
        </div>
      ))}
    </>
  );
}

export default AnnouncementList;
