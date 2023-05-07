import React, { useCallback } from 'react';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useDispatch, useSelector } from 'react-redux';
import Link from '../../../common/icons/dogfoot.svg';
import { analytics } from '../../../index';
import './LinkCopy.scss';
import { RootState } from '../../../redux/store';

function LinkCopy(props: { setLoading: (loading: boolean) => void }) {
  const { setLoading } = props;
  const linkCopyEvent = useAnalyticsCustomLogEvent(analytics, 'link_copy');
  const url = useSelector((state: any) => state.map.link);
  const dogName = useSelector((state:RootState) => state.persist.user.pet.name);
  const selectedMungple = useSelector((state:RootState) => state.map.selectedId);

  const sendScrap = async () => {
    setLoading(true);
    await window.Kakao.Share.sendScrap({
      requestUrl: url,
      templateId: 92943,
    });
    setLoading(false);
  };

  const buttonClickHandler = () => {
    console.log(selectedMungple);
  };

  return (
    <div className="link" aria-hidden="true" onClick={buttonClickHandler}>
      <img src={Link} alt="link" />
      <div className="link-text">이곳에{` ${dogName}`} 발자국 남기기</div>
    </div>
  );
}

export default LinkCopy;
