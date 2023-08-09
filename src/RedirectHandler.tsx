/* eslint-disable react/react-in-jsx-scope */
import { SIGN_IN_PATH } from 'common/constants/path.const';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from 'redux/slice/userSlice';
import { RootState } from 'redux/store';

interface Props {
  children: ReactNode;
}

function RedirectHandler({ children }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { moveToLogin } = useSelector((state: RootState) => state.persist.user);
  // console.log(moveToLogin);
  useEffect(()=>{
    if(moveToLogin) {
      dispatch(userActions.redirectToLogin());
      navigate(SIGN_IN_PATH.MAIN);
    }
  } ,[moveToLogin]);

  return <div>{children}</div>;
}

export default RedirectHandler;
