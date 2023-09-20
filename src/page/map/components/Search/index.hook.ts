import { SearchedUser, searchUserList } from 'common/api/record';
import debounce from 'lodash/debounce';
import { Mungple } from 'page/map/index.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchAction } from 'redux/slice/searchSlice';
import { RootState } from 'redux/store';

const useSearch = (cafeList: Mungple[], selectId: (data: Mungple) => void) => {
  const { ref: placeRef, inView: placeInView } = useInView();
  const { ref: userRef, inView: userInView } = useInView();
  const [selectedTab, setSelectedTab] = useState<'keyword' | 'user'>('keyword');
  const [isFocus, setIsFocus] = useState(false);
  const [enteredInput, setEnteredInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [page, setPage] = useState(1);
  const [searchedUserList, setSearchedUserList] = useState<SearchedUser[]>([]);
  const [searchedKakaoPlace, setSearchedKakaoPlace] = useState<
    kakao.maps.services.PlacesSearchResultItem[]
  >([]);
  const recentSearch: Mungple[] = useSelector(
    (state: RootState) => state.persist.search.recentSearch,
  );
  const [option, setOption] = useState<Mungple[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const outsideRef = useOnclickOutside(() => {
    setIsFocus(false);
    document.getElementById('search')?.blur();
  });
  const inputFoucs = useCallback(() => {
    setIsFocus(true);
  }, []);

  const updateDebounceInput = useCallback(
    debounce((value) => setDebouncedInput(value), 500),
    [],
  );

  useEffect(() => {
    updateDebounceInput(enteredInput);
  }, [enteredInput, updateDebounceInput]);

  const { data: infiniteUserList, fetchNextPage } = useInfiniteQuery(
    ['getUserSearch', debouncedInput],
    ({ pageParam = 0 }) => searchUserList(debouncedInput, pageParam, 10),
    {
      getNextPageParam: (last) => {
        if (last) return last.last ? undefined : last.number + 1;
      },
    },
  );

  /* Searched Items onClickHandlers (Mungple, Recent, Users) */
  const onClickMungpleHandler = (cafe: Mungple) => {
    selectId(cafe);
    dispatch(searchAction.setRecentSearch(cafe));
    setIsFocus(false);
    setOption([]);
  };
  const onClickRecentHandler = (cafe: Mungple) => {
    selectId(cafe);
    setIsFocus(false);
  };
  const onClickUserHandler = (user: SearchedUser) => {
    navigate(`/photo/${user.userId}`, { state: { from: 'search' } });
  };

  useEffect(() => {
    if (debouncedInput.length === 0) setSearchedKakaoPlace([]);
    searchFromKakao(debouncedInput, true);
  }, [debouncedInput]);

  const userList = useMemo(
    () =>
      infiniteUserList && infiniteUserList.pages.length > 0
        ? infiniteUserList.pages.flatMap((user) => (user ? [...user.content] : []))
        : [],
    [infiniteUserList],
  );

  // 키워드 기반 장소 검색
  const searchFromKakao = (place: string, isFirst?: boolean) => {
    const placeSearchCB = (
      data: kakao.maps.services.PlacesSearchResult,
      status: kakao.maps.services.Status,
    ) => {
      if (status === kakao.maps.services.Status.OK) {
        const list = isFirst ? data : [...searchedKakaoPlace, ...data];
        setSearchedKakaoPlace(list);
      }
    };
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(place, placeSearchCB, {
      size: 15,
      page: page,
    });
    setPage(page + 1);
  };

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

  useEffect(() => {
    if (placeInView) searchFromKakao(enteredInput);
  }, [placeInView]);

  useEffect(() => {
    if (userInView) fetchNextPage();
  }, [userInView]);

  return {
    states: {
      placeRef,
      option,
      enteredInput,
      recentSearch,
      outsideRef,
      selectedTab,
      isFocus,
      searchedKakaoPlace,
      userList,
    },
    actions: {
      inputChangeHandler,
      inputFoucs,
      setSelectedTab,
      onClickMungpleHandler,
      onClickRecentHandler,
      onClickUserHandler,
    },
  };
};

export default useSearch;
