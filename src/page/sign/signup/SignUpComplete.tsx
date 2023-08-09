import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import './SignUpComplete.scss';
import Delgo from '../../../common/icons/delgo.svg';
import Check from '../../../common/icons/check.svg';
import { ROOT_PATH } from '../../../common/constants/path.const';

interface PetName {
  name: string;
}

function SignUpComplete() {
  const state = useLocation().state as PetName;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <img src={Delgo} alt="logo" className="mt-[170px] aspect-[207/47] w-[50vw] " />
      <div className="mt-[74px] flex h-[65px] w-[65px] animate-signupcomplete items-center justify-center rounded-[100%] bg-[#aa93ec]">
        <img src={Check} alt="check" className="w-[33px]" />
      </div>
      <div className="mt-4 text-lg font-bold leading-[27px] text-[#3f3f3f]">
        가입완료!
      </div>
      <button
        type="button"
        className="login-button active"
        onClick={() => {
          navigate(ROOT_PATH);
        }}
      >
        {state.name}와(과) 여행을 떠나요
      </button>
    </div>
  );
}

export default SignUpComplete;
