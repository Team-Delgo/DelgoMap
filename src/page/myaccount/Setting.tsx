import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AxiosResponse } from 'axios';
import Arrow from '../../common/icons/left-arrow.svg';
import './Setting.scss';
import { MY_ACCOUNT_PATH, SIGN_IN_PATH } from '../../common/constants/path.const';
import { RootState } from '../../redux/store';
import DeleteBottomSheet from '../../common/dialog/ConfirmBottomSheet';
import { deleteUser } from '../../common/api/signup';
import { userActions } from '../../redux/slice/userSlice';
import { setPushNotification } from '../../common/api/myaccount';

function Setting() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.persist.user);
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [alert, setAlert] = useState(user?.notify);
  const navigate = useNavigate();
  const location: any = useLocation();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const moveToMyAccountMainPage = () => {
    navigate(MY_ACCOUNT_PATH.MAIN, {
      state: {
        prevPath: location.pathname,
      },
    });
  };

  const deleteUserId = () => {
    deleteUser(
      user.id,
      (response: AxiosResponse) => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
        dispatch(userActions.signout());
        navigate(SIGN_IN_PATH.MAIN);
      },
      dispatch,
    );
  };

  const openBottomSheet = () => {
    setBottomSheetIsOpen(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetIsOpen(false);
  };

  const handleSetPushNotification = () => {
    setPushNotification(
      user.id,
      (response: AxiosResponse) => {
        const { code,data } = response.data;
        if (code === 200) {
          dispatch(userActions.changeNotification({
            notify: data
          }))
          setAlert(!alert);
        }
      },
      dispatch,
    );
  };

  return (
    <div className="setting">
      <header className="setting-header">
        <div aria-hidden="true" className="setting-back" onClick={moveToMyAccountMainPage}>
          <img src={Arrow} alt="arrow" />
        </div>
        ??????
      </header>
      <div className="setting-menu">
        <div className="setting-alert">
          <div className="setting-labels" aria-hidden="true" onClick={handleSetPushNotification}>
            <div className="setting-label">????????????</div>
            <div className="setting-p">????????? / ???????????? ??????</div>
          </div>
          <div
            className={classNames('setting-alert-button', { on: alert })}
            aria-hidden="true"
            onClick={handleSetPushNotification}
          >
            <div className={classNames('setting-alert-button-toggle', { on: alert })} />
          </div>
        </div>
        <div className="setting-version">
          <div className="setting-label">????????????</div>
          <div className="setting-version-number">1.0.0</div>
        </div>
        <div
          aria-hidden="true"
          className="setting-others"
          onClick={() => {
            navigate(MY_ACCOUNT_PATH.TERM1);
          }}
        >
          <div className="setting-label">????????????</div>
        </div>
        <div
          aria-hidden="true"
          className="setting-others"
          onClick={() => {
            navigate(MY_ACCOUNT_PATH.TERM2);
          }}
        >
          <div className="setting-label">???????????? ????????????</div>
        </div>
        <div className="setting-others">
          <div className="setting-label">????????????</div>
        </div>
        <div className="setting-others" aria-hidden="true" onClick={openBottomSheet}>
          <div className="setting-label">????????????</div>
        </div>
      </div>
      <DeleteBottomSheet
        text="?????? ?????? ??????????????????????"
        description="???????????? ??????????????? ????????? ????????????..."
        cancelText="??????"
        acceptText="???????????????"
        acceptButtonHandler={deleteUserId}
        cancelButtonHandler={closeBottomSheet}
        bottomSheetIsOpen={bottomSheetIsOpen}
      />
    </div>
  );
}

export default Setting;
