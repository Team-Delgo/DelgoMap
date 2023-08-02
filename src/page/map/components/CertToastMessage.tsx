import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Link from '../../../common/icons/dogfoot.svg';
import './LinkCopy.scss';
import { RootState } from '../../../redux/store';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { UPLOAD_PATH, SIGN_IN_PATH } from '../../../common/constants/path.const';
import AlertConfirm from '../../../common/dialog/AlertConfirm';

function LinkCopy(props: {
  isMungple: boolean;
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { isMungple } = props;
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const dogName = useSelector((state: RootState) => state.persist.user.pet.name);
  const selectedMungple = useSelector((state: RootState) => state.map.selectedId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setCertLocation = () => {
    if (!isSignIn) {
      setIsAlertOpen(true);
      return;
    }

    const isMungple = selectedMungple?.title !== '';
    dispatch(
      uploadAction.setHomeCert({
        latitude: selectedMungple.lat,
        longitude: selectedMungple.lng,
        mongPlaceId: selectedMungple.id,
        title: selectedMungple.title,
        address: selectedMungple.address,
        categoryCode: selectedMungple.categoryCode,
      }),
    );
    navigate(UPLOAD_PATH.CERTIFICATION, {
      state: { prevPath: isMungple ? 'homeMungple' : 'homeMap' },
    });
  };

  const sendLoginPage = () => {
    navigate(SIGN_IN_PATH.MAIN);
  };

  return (
    <>
      <div
        className={classNames('link', { isMungple })}
        aria-hidden="true"
        onClick={setCertLocation}
      >
        <img src={Link} alt="link" className='ml-[20px]' />
        <div className="link-text">이곳에{` ${dogName}`} 발자국 남기기</div>
      </div>
      {isAlertOpen && (
        <AlertConfirm
          text="로그인이 필요한 기능입니다."
          buttonText="로그인"
          yesButtonHandler={sendLoginPage}
          noButtonHandler={() => setIsAlertOpen(false)}
        />
      )}
    </>
  );
}

export default LinkCopy;
