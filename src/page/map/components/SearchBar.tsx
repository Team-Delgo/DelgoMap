import React, { useCallback, useState, useMemo } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useDispatch, useSelector } from 'react-redux';
import { Mungple } from './maptype';
import './SearchBar.scss';
// import BackArrow from '../../../common/icons/back-arrow.svg';
import BackArrowComponent from '../../../components/BackArrowComponent';
import { searchAction } from '../../../redux/slice/searchSlice';
import { RootState } from '../../../redux/store';

function SearchBar(props: { cafeList: Mungple[]; selectId: (data: Mungple) => void; close: () => void }) {
  const { cafeList, selectId, close } = props;
  const [isFocus, setIsFocus] = useState(false);
  const [enteredInput, setEnteredInput] = useState('');
  const recentSearch: Mungple[] = useSelector((state: RootState) => state.persist.search.recentSearch);
  const [option, setOption] = useState<Mungple[]>([]);
  const ref = useOnclickOutside(() => {
    setIsFocus(false);
    document.getElementById('search')?.blur();
  });
  const dispatch = useDispatch();
  const inputFoucs = useCallback(() => {
    setIsFocus(true);
  }, []);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredInput(e.target.value);
    if (cafeList.length > 0 && e.target.value.length > 0) {
      let autoComplete: Mungple[];
      if (e.target.value.length > 1) {
        autoComplete = cafeList.filter((cafe) => {
          return (
            cafe.placeName.includes(e.target.value) ||
            cafe.jibunAddress.includes(e.target.value) ||
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
          <div className="search-auto-item" aria-hidden="true" onClick={onClickHandler} key={cafe.placeName}>
            {cafe.placeName}
            <span>{cafe.roadAddress}</span>
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
          <div className="search-auto-item" aria-hidden="true" onClick={onClickHandler} key={cafe.placeName}>
            {cafe.placeName}
            <span>{cafe.roadAddress}</span>
          </div>
        );
      }),
    [recentSearch],
  );

  return (
    <div ref={ref} className="search-wrapper">
      <div className="search-header">
        <BackArrowComponent onClickHandler={close}/>
        {/* <img src={BackArrow} alt="back" aria-hidden="true" onClick={close} /> */}
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
      {isFocus && option.length > 0 && enteredInput.length > 0 && <div className="search-auto">{autoCompleteContext}</div>}
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
