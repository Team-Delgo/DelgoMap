import { SIGN_IN_PATH } from 'common/constants/path.const';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from 'redux/store';

function Account() {
  const isSignIn = useSelector((state: RootState) => state.persist.user.isSignIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignIn) navigate(SIGN_IN_PATH.MAIN);
  }, [isSignIn]);

  return (
    <>
      <Outlet />
    </>
  );
}
export default Account;
