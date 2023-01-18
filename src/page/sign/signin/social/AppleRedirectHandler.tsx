import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { appleSendToken } from '../../../../common/api/social';
import Loading from '../../../../common/utils/Loading';
import AlertConfirm from '../../../../common/dialog/AlertConfirm';
import { SIGN_UP_PATH } from '../../../../common/constants/path.const';
import AlertConfirmOne from '../../../../common/dialog/AlertConfirmOne';
import { userActions } from '../../../../redux/slice/userSlice';

function AppleRedirectHandler() {
  const [signUp, setSignUp] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [appleCode, setAppleCode] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = window.location.href;
  const i = url.indexOf('id_token');
  const token = url.substring(i + 9);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = () => {
    appleSendToken(
      token,
      (response: AxiosResponse) => {
        const { code } = response.data;
        if (code === 200) {
          // 유저 정보, token dispatch
          navigate('/');
        } else if (code === 383) {
          setSignUp(true);
          setAppleCode(response.data.data);
        } else {
          setLoginFailed(true);
        }
        console.log(response);
      },
      dispatch,
    );
  };

  const moveToPreviousPage = () => {
    navigate('/user/signin');
  };

  const moveToSignUpPage = () => {
    navigate(SIGN_UP_PATH.TERMS, { state: { isSocial: 'A', phone: '', email: '' } });
    dispatch(userActions.setAppleCode(appleCode));

  };

  return (
    <div>
      <Loading />
      {signUp && (
        <AlertConfirm
          text="애플로 가입된 계정이 없습니다"
          buttonText="회원가입"
          yesButtonHandler={moveToSignUpPage}
          noButtonHandler={moveToPreviousPage}
        />
      )}
      {loginFailed && <AlertConfirmOne text="애플 로그인에 실패하였습니다" buttonHandler={moveToPreviousPage} />}
    </div>
  );
}

export default AppleRedirectHandler;
