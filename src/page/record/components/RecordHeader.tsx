import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './RecordHeader.scss';
import { ROOT_PATH, POSTS_PATH } from '../../../common/constants/path.const';
import { RootState } from '../../../redux/store';
import PageHeader from '../../../components/PageHeader';
import FooterNavigation from 'components/FooterNavigation';
import { postType } from 'common/types/post';

function RecordHeader() {
  const splitUrl = window.location.href.split('/');
  const userId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const myId = useSelector((state: RootState) => state.persist.user.user.id);
  const pageFrom = (useLocation()?.state?.prevPath as string) || 'home';
  const post = useLocation()?.state?.post as postType;
  let isMyRecordPage = userId === myId;

  let tab = (useLocation().state as any) || 'photo';
  if (tab.from === 'home') {
    tab = 'photo';
  }
  const [selected, setSeleceted] = useState({
    photo: false,
    calendar: true,
    achieve: false,
  });
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    if (isMyRecordPage) navigate(ROOT_PATH);
    else if(pageFrom === 'home') navigate(ROOT_PATH);
    else if (pageFrom !== 'home') navigate(pageFrom, { state: { post } });
    else navigate(POSTS_PATH);
  }, []);
  const clickHandler = (e: any) => {
    const { id } = e.target;
    setSeleceted((prev) => {
      const temp = {
        photo: false,
        calendar: false,
        achieve: false,
      };
      return { ...temp, [id]: true };
    });
    if (userId) {
      navigate(`/${id}/${userId}`, { state: id });
    }
  };

  return (
    <div className={classNames('recordHeader-wrapper', { fixed: tab === 'calendar' })}>
      <PageHeader navigate={handleNavigate} title="" short />
      <div className="recordHeader">
        <div
          aria-hidden="true"
          id="photo"
          className={classNames('recordHeader-item', { select: tab === 'photo' })}
          onClick={clickHandler}
        >
          앨범
        </div>
        <div
          aria-hidden="true"
          id="calendar"
          className={classNames('recordHeader-item', { select: tab === 'calendar' })}
          onClick={clickHandler}
        >
          달력
        </div>
        <div
          aria-hidden="true"
          id="achieve"
          className={classNames('recordHeader-item', { select: tab === 'achieve' })}
          onClick={clickHandler}
        >
          활동
        </div>
        <div className="recordHeader-divider" />
        <div
          className="fixed bottom-0 w-[100%]"
          style={{ display: isMyRecordPage ? 'block' : 'none' }}
        >
          <FooterNavigation page='record'/>
        </div>
      </div>
    </div>
  );
}

export default RecordHeader;
