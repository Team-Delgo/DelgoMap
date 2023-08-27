import React, { useCallback, useState, useMemo } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useDispatch, useSelector } from 'react-redux';
import { Mungple } from '../index.types';
import './SearchBar.scss';
import BackArrowComponent from '../../../components/BackArrowComponent';
import { searchAction } from '../../../redux/slice/searchSlice';
import { RootState } from '../../../redux/store';
import SearchIcon from '../../../common/icons/search.svg';

function SearchBar(props: {
  cafeList: Mungple[];
  selectId: (data: Mungple) => void;
  close: () => void;
}) {
  const { cafeList, selectId, close } = props;
  const [isFocus, setIsFocus] = useState(false);
  const [enteredInput, setEnteredInput] = useState('');
  const [kakaoPlaceSearch, setKakaoPlaceSearch] = useState<
    kakao.maps.services.PlacesSearchResultItem[]
  >([]);
  const recentSearch: Mungple[] = useSelector(
    (state: RootState) => state.persist.search.recentSearch,
  );
  const [option, setOption] = useState<Mungple[]>([]);
  const ref = useOnclickOutside(() => {
    setIsFocus(false);
    document.getElementById('search')?.blur();
  });
  const dispatch = useDispatch();
  const inputFoucs = useCallback(() => {
    setIsFocus(true);
  }, []);

  // 키워드 기반 장소 검색
  const searchFromKakao = useCallback(() => {
    const placeSearchCB = (
      data: kakao.maps.services.PlacesSearchResult,
      status: kakao.maps.services.Status,
      pagination: kakao.maps.Pagination,
    ) => {
      if (status === kakao.maps.services.Status.OK) {
        setKakaoPlaceSearch(data);
      }
    };
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(enteredInput, placeSearchCB, {
      size: 5,
    });
  }, [enteredInput]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredInput(e.target.value);
    if (cafeList.length > 0 && e.target.value.length > 0) {
      let autoComplete: Mungple[];
      if (e.target.value.length > 1) {
        autoComplete = cafeList.filter((cafe) => {
          return (
            cafe.placeName.includes(e.target.value) ||
            cafe.address.includes(e.target.value) ||
            cafe.placeNameEn?.includes(e.target.value)
          );
        });
      } else {
        autoComplete = cafeList.filter((cafe) => {
          return cafe.placeName.includes(e.target.value);
        });
      }
      setOption(autoComplete);
    }
  };

  const autoCompleteContext = useMemo(
    () =>
      option.map((cafe) => {
        const onClickHandler = () => {
          selectId(cafe);
          dispatch(searchAction.setRecentSearch(cafe));
          setIsFocus(false);
          setOption([]);
        };
        return (
          <div
            className="search-auto-item"
            aria-hidden="true"
            onClick={onClickHandler}
            key={cafe.placeName}
          >
            {cafe.placeName}
            <span>{cafe.address}</span>
          </div>
        );
      }),
    [option],
  );

  const recentContext = useMemo(
    () =>
      recentSearch.map((cafe) => {
        const onClickHandler = () => {
          selectId(cafe);
          setIsFocus(false);
        };
        return (
          <div
            className="search-auto-item"
            aria-hidden="true"
            onClick={onClickHandler}
            key={cafe.placeName}
          >
            {cafe.placeName}
            <span>{cafe.address}</span>
          </div>
        );
      }),
    [recentSearch],
  );

  return (
    <div ref={ref} className="search-wrapper flex flex-col items-center">
      <div className="search-header">
        <BackArrowComponent onClickHandler={close} />
        <div className="search">
          <input
            id="search"
            autoComplete="off"
            placeholder="검색"
            value={enteredInput}
            onChange={inputChangeHandler}
            onClick={inputFoucs}
          />
        </div>
      </div>
      {isFocus && option.length > 0 && enteredInput.length > 0 && (
        <div className="search-auto mt-[24px]">{autoCompleteContext}</div>
      )}
      {enteredInput.length > 0 && (
        <span className="mt-[30px] inline-flex items-center justify-center rounded-[42px] border border-[#ababab] bg-white px-[15px] py-[8px] text-[14px] font-medium">
          <img className="mr-[8px] h-[14px] w-[14px]" src={SearchIcon} alt="search" />
          <div className="text-[#6f40f3]">{`'${enteredInput}'`}</div>
          <div>관련 결과 더보기</div>
        </span>
      )}
      {option.length === 0 && enteredInput.length === 0 && (
        <div className="search-empty">
          <div className="search-empty-desc">반려견 동반장소를 검색해보세요</div>
          <div className="search-empty-line" />
          <div className="search-recent-tag">
            <h4>최근 검색</h4>
          </div>
          <div className="search-recent">{recentContext}</div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
