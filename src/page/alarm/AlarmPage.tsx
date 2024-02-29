import React, { useEffect, useState } from 'react';
import PageHeader from 'components/PageHeader';
import { DETAIL_MUNGPLE, RECORD_PATH, ROOT_PATH } from 'common/constants/path.const';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { getAlarmList } from 'common/api/alarm';
import Loading from 'common/utils/BallLoading';
import AlarmTab from './AlarmTab';
import AnnouncementList from './AnnouncementList';
import ActivityList from './ActivityList';
import { Notification, NotificationTab } from 'common/types/notifiication';
import { useErrorHandlers } from 'common/api/useErrorHandlers';
import { AxiosError } from 'axios';

function AlarmPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.persist.user);
  const [activityList, setActivityList] = useState([]);
  const [announcementList, setAnnouncementList] = useState([]);
  const [currentTab, setCurrentTab] = useState<NotificationTab>('activity');
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAlarmList = async () => {
      try {
        const { data } = await getAlarmList(user.id);

        const activityNotis = data.filter(
          ({ notificationType }: Notification) =>
            notificationType !== 'Mungple' && notificationType !== 'MungpleByOther',
        );
        const announcementNotis = data.filter(
          ({ notificationType }: Notification) =>
            notificationType === 'Mungple' || notificationType === 'MungpleByOther',
        );
        setActivityList(activityNotis);
        setAnnouncementList(announcementNotis);
      } catch (err: AxiosError | any) {
        useErrorHandlers(dispatch, err);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlarmList();
  }, []);

  const handleAlarmClick = (notification: Notification) => {
    let path;

    if (['Comment', 'Helper', 'Cute'].includes(notification?.notificationType)) {
      path = RECORD_PATH.CERT_DETAIL.replace(':id', notification.objectId.toString());
      navigate(path);
    } else if (
      ['Mungple', 'MungpleByMe', 'MungpleByOther'].includes(notification.notificationType)
    ) {
      path = DETAIL_MUNGPLE.replace(':id', notification.objectId.toString());
      navigate(path, {
        state: { prevPath: 'alarm' },
      });
    }
  };

  const renderCurrentContent = () => {
    switch (currentTab) {
      case 'activity':
        return (
          <ActivityList activityList={activityList} handleAlarmClick={handleAlarmClick} />
        );
      case 'announcement':
        return (
          <AnnouncementList
            announcementList={announcementList}
            handleAlarmClick={handleAlarmClick}
          />
        );
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <PageHeader
        title="알림"
        navigate={() => navigate(ROOT_PATH)}
        isFixed
        isAbsolute={false}
        short={false}
      />
      <AlarmTab currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="mx-5 mt-24">{renderCurrentContent()}</div>
    </>
  );
}

export default AlarmPage;
