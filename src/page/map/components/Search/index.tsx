import React, { useCallback, useState, useMemo, useEffect } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { Mungple } from '../../index.types';
import './index.scss';
import BackArrowComponent from '../../../../components/BackArrowComponent';
import { searchAction } from '../../../../redux/slice/searchSlice';
import { RootState } from '../../../../redux/store';
import SearchIcon from '../../../../common/icons/search.svg';
import SearchMore from './SearchMore';
import { useInView } from 'react-intersection-observer';
import { icons } from '../PlaceCard';

interface Props {
  selectKakaoPlace: (location: kakao.maps.LatLng) => void;
  cafeList: Mungple[];
  selectId: (data: Mungple) => void;
  close: () => void;
}

function SearchBar({ cafeList, selectId, close, selectKakaoPlace }: Props) {
  const { ref, inView } = useInView();
  const [selectedTab, setSelectedTab] = useState<'keyword' | 'user'>('keyword');
  const [isFocus, setIsFocus] = useState(false);
  const [isSearchMore, setIsSearchMore] = useState(false);
  const [enteredInput, setEnteredInput] = useState('');
  const [page, setPage] = useState(1);
  const [kakaoPlaceSearch, setKakaoPlaceSearch] = useState<
    kakao.maps.services.PlacesSearchResultItem[]
  >([]);
  const recentSearch: Mungple[] = useSelector(
    (state: RootState) => state.persist.search.recentSearch,
  );
  const [option, setOption] = useState<Mungple[]>([]);
  const outsideRef = useOnclickOutside(() => {
    setIsFocus(false);
    document.getElementById('search')?.blur();
  });
  const dispatch = useDispatch();
  const inputFoucs = useCallback(() => {
    setIsFocus(true);
  }, []);

  // 키워드 기반 장소 검색
  const searchFromKakao = (place: string, isFirst?: boolean) => {
    const placeSearchCB = (
      data: kakao.maps.services.PlacesSearchResult,
      status: kakao.maps.services.Status,
    ) => {
      if (status === kakao.maps.services.Status.OK) {
        const list = isFirst ? data : [...kakaoPlaceSearch, ...data];
        setKakaoPlaceSearch(list);
      }
    };
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(place, placeSearchCB, {
      size: 15,
      page: page,
    });
    setPage(page + 1);
  };

  const debouncedSearchFromKakao = (place: string) => {
    if (place.length === 0) setKakaoPlaceSearch([]);
    else {
      setPage(1);
      searchFromKakao(place, true);
    }
  };

  const debouncedSave = useCallback(debounce(debouncedSearchFromKakao, 400), []);

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
    debouncedSave(e.target.value);
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
        const name = cafe.placeName.split(new RegExp(`(${enteredInput})`, 'gi'));
        const address = cafe.address.split(new RegExp(`(${enteredInput})`, 'gi'));
        return (
          <div
            className="mx-[55px] mt-[20px]"
            aria-hidden="true"
            onClick={onClickHandler}
            key={cafe.placeName}
          >
            <div className="flex items-center">
              {name.map((part, index) =>
                part === enteredInput ? (
                  <span key={index} className="font-medium text-[#7a7ccf]">
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
              <img
                className="ml-[5px] h-[15px] w-[15px]"
                src={icons[cafe.categoryCode]}
              />
            </div>
            <div className="text-[12px] text-[#646566]">
              {address.map((part, index) =>
                part === enteredInput ? (
                  <span key={index} className="font-medium text-[#7a7ccf]">
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
            </div>
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

  useEffect(() => {
    if (inView) searchFromKakao(enteredInput);
  }, [inView]);

  return (
    <div ref={outsideRef} className="search-wrapper flex flex-col items-center">
      <div className="search-header fixed bg-white">
        <div>
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
        {enteredInput.length > 0 && (
          <div className="mt-[24px] flex w-full justify-evenly">
            <div
              className={`${
                selectedTab === 'keyword'
                  ? ' border-b-[3px] border-b-black text-black'
                  : 'text-[#646566]'
              } px-[3px]`}
            >
              장소
            </div>
            <div
              className={`${
                selectedTab === 'user'
                  ? ' border-b-[3px] border-b-black text-black'
                  : 'text-[#646566]'
              } px-[3px]`}
            >
              프로필
            </div>
          </div>
        )}
      </div>
      {option.length === 0 && enteredInput.length === 0 && (
        <div className="search-empty">
          <div className="search-recent-tag mt-[80px]">
            <h4>최근 검색</h4>
          </div>
          <div className="search-recent">{recentContext}</div>
        </div>
      )}
      {enteredInput.length > 0 && (
        <div className="mt-[80px] w-full">
          <div>
            {isFocus && option.length > 0 && enteredInput.length > 0 && (
              <div className="search-auto mt-[24px]">{autoCompleteContext}</div>
            )}
          </div>
          <div>
            {option.length > 0 && (
              <div className="mt-[20px] h-[3px] w-full bg-[#f6f6f6]" />
            )}
            {kakaoPlaceSearch.map((place) => (
              <div
                className="mx-[55px] mt-[20px]"
                aria-hidden
                onClick={() =>
                  selectKakaoPlace(
                    new kakao.maps.LatLng(parseFloat(place.y),parseFloat(place.x)),
                  )
                }
              >
                <div className="text-[15px]">{place.place_name}</div>
                <div className="text-[12px] text-[#646566]">{place.address_name}</div>
              </div>
            ))}
            <div ref={ref}>&nbsp;</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
