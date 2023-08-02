import React, { ChangeEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import Arrow from '../../../../common/icons/left-arrow.svg';
import DetailTerm from './DetailTerm';
import { SIGN_IN_PATH, SIGN_UP_PATH } from '../../../../common/constants/path.const';
import './Terms.scss';
import Check from '../../../../common/icons/check.svg';

interface LocationState {
  isSocial: string;
  phone: string;
  email: string;
  socialId: string;
}

interface Term {
  term1: boolean;
  term2: boolean;
  term3: boolean;
}

function Terms() {
  const navigation = useNavigate();
  const state = useLocation().state as LocationState;
  const { isSocial, phone, email, socialId } = state;
  const [eachTermChecked, setEachTermChecked] = useState<any>({
    term1: false,
    term2: false,
    term3: false,
  });
  const [selectedId, setSelctedId] = useState(0);
  const [allChecked, setAllChecked] = useState(false);
  const { term1, term2, term3 } = eachTermChecked;

  useEffect(() => {
    if (eachTermChecked.term1 && eachTermChecked.term2 && eachTermChecked.term3) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [eachTermChecked]);

  const onCheckHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, id } = e.target;
    if (selectedId) {
      setSelctedId(0);
    }
    setEachTermChecked((prev: Term) => {
      return { ...prev, [id]: checked };
    });
  };

  const onAllCheckHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setAllChecked(checked);
    if (!checked) {
      setEachTermChecked({ term1: false, term2: false, term3: false });
    }
  };

  useEffect(() => {
    if (allChecked) {
      setEachTermChecked({ term1: true, term2: true, term3: true });
    }
  }, [allChecked]);

  const nextClickHandler = () => {
    setTimeout(() => {
      if (isSocial === 'K' || isSocial === 'N') {
        navigation(SIGN_IN_PATH.PHONEAUTH, {
          state: { phone, isSocial, email, socialId },
        });
      } else if (isSocial === 'A') {
        navigation(SIGN_UP_PATH.VERIFY, { state: { isSocial: 'A' } });
      } else {
        navigation(SIGN_UP_PATH.VERIFY, { state: { isSocial: 'D' } });
      }
    }, 300);
  };

  const viewOpenHandler = (event: any) => {
    let { id } = event.target;
    id = parseInt(id, 10);
    setSelctedId(id);
  };

  const viewCloesHandler = () => {
    setSelctedId(0);
  };

  return (
    <div className="relative flex h-screen flex-col items-center">
      <div
        className="absolute left-[21px] top-[5px] flex h-[25px] w-[25px] items-center justify-center rounded-[100%] active:animate-backButton"
        aria-hidden="true"
        onClick={
          !selectedId
            ? () => {
                setTimeout(() => {
                  if (isSocial === 'K' || isSocial === 'N') {
                    navigation(SIGN_IN_PATH.MAIN);
                  } else {
                    navigation(-1);
                  }
                }, 200);
              }
            : viewCloesHandler
        }
      >
        <img className="h-5 w-[22px]" src={Arrow} alt="arrow" />
      </div>
      <header className="mt-2 font-[#3f3f3f] text-lg font-medium">
        {!selectedId ? '약관동의' : '이용약관'}
      </header>
      {!selectedId && (
        <>
          <span className="mt-[14px] whitespace-pre-line text-center text-sm font-normal leading-[150%] text-[#8a8a8a;]">{`원활한 서비스를 위해 이용약관\n동의 내용에 동의해주세요`}</span>
          <div className="mt-[38px] w-[91vw] rounded-[7px] bg-[#3d3d3f]">
            <div className="relative mx-[20px] my-[25px]">
              <label
                className="flex items-center text-[14px] font-normal leading-[150%] text-[white]"
                htmlFor="term1"
              >
                <input
                  className="hidden"
                  type="checkbox"
                  id="term1"
                  checked={term1}
                  onChange={onCheckHandler}
                />
                <span
                  className={`
                ${
                  eachTermChecked.term1 &&
                  `before:absolute before:left-[-1px] before:top-[-1px] before:h-[26px] before:w-[26px] before:animate-checkboxCheck before:rounded-[100%] before:border
                before:border-[#aa93ec] before:bg-[#aa93ec]`
                }
                relative ml-[7px] mr-[13px] inline-block h-[26px] w-[26px] rounded-[100%] border border-[#ececec] bg-[white]`}
                >
                  <img
                    className="absolute left-[50%] top-[50%] z-10 -translate-x-[50%] -translate-y-[50%]"
                    src={Check}
                    alt="check"
                  />
                </span>
                [필수]이용약관 동의
              </label>
              <span
                aria-hidden="true"
                className="absolute right-[12px] top-[3.5px] h-[40px] w-[50px] cursor-pointer text-right text-[14px] font-normal leading-[150%] text-white"
                id="1"
                onClick={viewOpenHandler}
              >
                보기
              </span>
            </div>
            <div className="relative mx-[20px] my-[25px]">
              <label
                htmlFor="term2"
                className="flex items-center text-[14px] font-normal leading-[150%] text-[white]"
              >
                <input
                  className="hidden"
                  type="checkbox"
                  id="term2"
                  checked={term2}
                  onChange={onCheckHandler}
                />
                <span
                  className={`
                ${
                  eachTermChecked.term2 &&
                  `before:absolute before:left-[-1px] before:top-[-1px] before:h-[26px] before:w-[26px] before:animate-checkboxCheck before:rounded-[100%] before:border
                before:border-[#aa93ec] before:bg-[#aa93ec]`
                }
                relative ml-[7px] mr-[13px] inline-block h-[26px] w-[26px] rounded-[100%] border border-[#ececec] bg-[white]`}
                >
                  <img
                    className="absolute left-[50%] top-[50%] z-10 -translate-x-[50%] -translate-y-[50%]"
                    src={Check}
                    alt="check"
                  />
                </span>
                [필수]만 14세 이상 확인
              </label>
              <span
                aria-hidden="true"
                className="absolute right-[12px] top-[3.5px] h-[40px] w-[50px] cursor-pointer text-right text-[14px] font-normal leading-[150%] text-white"
                id="2"
                onClick={viewOpenHandler}
              >
                보기
              </span>
            </div>
            <div className="relative mx-[20px] my-[25px]">
              <label
                className="flex items-center text-[14px] font-normal leading-[150%] text-[white]"
                htmlFor="term3"
              >
                <input
                  className="hidden"
                  type="checkbox"
                  id="term3"
                  checked={term3}
                  onChange={onCheckHandler}
                />
                <span
                  className={`
                ${
                  eachTermChecked.term3 &&
                  `before:absolute before:left-[-1px] before:top-[-1px] before:h-[26px] before:w-[26px] before:animate-checkboxCheck before:rounded-[100%] before:border
                before:border-[#aa93ec] before:bg-[#aa93ec]`
                }
                relative ml-[7px] mr-[13px] inline-block h-[26px] w-[26px] rounded-[100%] border border-[#ececec] bg-[white]`}
                >
                  <img
                    className="absolute left-[50%] top-[50%] z-10 -translate-x-[50%] -translate-y-[50%]"
                    src={Check}
                    alt="check"
                  />
                </span>
                [필수]개인정보 수집 이용 동의
              </label>
              <span
                aria-hidden="true"
                className="absolute right-[12px] top-[3.5px] h-[40px] w-[50px] cursor-pointer text-right text-[14px] font-normal leading-[150%] text-white"
                id="3"
                onClick={viewOpenHandler}
              >
                보기
              </span>
            </div>
          </div>
          <div className="mt-[41px] w-[91vw]">
            <div className="mx-[20px]">
              <label
                className="flex items-center text-sm font-bold leading-[150%] text-[#3f3f3f]"
                htmlFor="all"
              >
                <input
                  className="relative top-[2px] mr-[18px] hidden cursor-pointer"
                  type="checkbox"
                  id="all"
                  checked={allChecked}
                  onChange={onAllCheckHandler}
                />
                <span
                  className={`
                ${
                  allChecked &&
                  `before:absolute before:left-[-1px] before:top-[-1px] before:h-[26px] before:w-[26px] before:animate-checkboxCheck before:rounded-[100%] before:border
                before:border-[#aa93ec] before:bg-[#aa93ec]`
                }
                relative ml-[7px] mr-[13px] inline-block h-[26px] w-[26px] rounded-[100%] border border-[#ececec] bg-[white]`}
                >
                  <img
                    className="absolute left-[50%] top-[50%] z-10 -translate-x-[50%] -translate-y-[50%]"
                    src={Check}
                    alt="check"
                  />
                </span>
                모두 확인 및 동의합니다.
              </label>
            </div>
          </div>
          <button
            type="button"
            disabled={!allChecked}
            className={`${
              allChecked ? `bg-[#3f3f3f]` : `bg-[#c4c4c4] `
            } mt-[50px] h-[56px] w-[88vw] rounded-xl text-center text-lg font-bold leading-[22px] text-white shadow-[0_5px_13px_rgba(o,0,0,0.05)] transition-all duration-300`}
            onClick={nextClickHandler}
          >
            동의합니다
          </button>
        </>
      )}
      {!!selectedId && (
        <>
          <div className="mt-[38px] w-[91vw] rounded-[7px] bg-[#f2f2f2]">
            <DetailTerm id={selectedId} />
          </div>
          <div className="top-[10px] mb-0 ml-0 mr-auto mt-0 px-[54px] py-[39px]">
            <label className="flex items-center" htmlFor={`term${selectedId}`}>
              <input
                className="hidden"
                type="checkbox"
                id={`term${selectedId}`}
                checked={eachTermChecked[`term${selectedId}`]}
                onChange={onCheckHandler}
              />
              <span
                className={`
                ${
                  eachTermChecked[`term${selectedId}`] &&
                  `before:absolute before:left-[-1px] before:top-[-1px] before:h-[26px] before:w-[26px] before:rounded-[100%] before:border before:border-[#aa93ec]
                before:bg-[#aa93ec]`
                }
                relative ml-[7px] mr-[13px] inline-block h-[26px] w-[26px] rounded-[100%] border border-[#ececec] bg-[white]`}
              >
                <img
                  className="absolute left-[50%] top-[50%] z-10 -translate-x-[50%] -translate-y-[50%]"
                  src={Check}
                  alt="check"
                />
              </span>
              확인 및 동의합니다
            </label>
          </div>
        </>
      )}
    </div>
  );
}

export default Terms;
