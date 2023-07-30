import { SIGN_IN_PATH } from 'common/constants/path.const';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'redux/store';

interface Props {
  children: ReactNode;
}

const RedirectHandler = ({ children }: Props) => {
  const navigate = useNavigate();
  const { isSignIn } = useSelector((state: RootState) => state.persist.user);

  useEffect(()=>{
    if(!isSignIn) navigate(SIGN_IN_PATH.MAIN);
  } ,[isSignIn]);

  return <>{children}</>;
};

export default RedirectHandler;