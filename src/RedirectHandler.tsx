/* eslint-disable react/react-in-jsx-scope */
import { SIGN_IN_PATH } from 'common/constants/path.const';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'redux/store';

interface Props {
  children: ReactNode;
}

function RedirectHandler({ children }: Props) {
  const navigate = useNavigate();
  const { isSignIn } = useSelector((state: RootState) => state.persist.user);
  console.log(isSignIn);
  useEffect(() => {
    if (!isSignIn) navigate(SIGN_IN_PATH.MAIN);
  }, [isSignIn]);

  return <div>{children}</div>;
}

export default RedirectHandler;
