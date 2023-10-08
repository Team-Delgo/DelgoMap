import { useMemo } from 'react';
import { Mungple } from '../../../../common/types/map';
import './index.scss';
import BackArrowComponent from '../../../../components/BackArrowComponent';
import { icons } from '../PlaceCard';
import useSearch from './index.hook';
import { MungpleMap, MungpleResponseDTO } from 'common/api/record';

interface Props {
  selectKakaoPlace: (location: kakao.maps.LatLng) => void;
  cafeList: MungpleResponseDTO;
  selectId: (data: MungpleMap) => void;
  close: () => void;
}

function SearchBar({ cafeList, selectId, close, selectKakaoPlace }: Props) {
  const {
    states: {
      option,
      enteredInput,
      placeRef,
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
  } = useSearch(cafeList, selectId);

  // 유저 검색
  const searchedUserList = useMemo(
    () =>
      userList.map((user) => {
        const nickname = user.nickname.split(new RegExp(`(${enteredInput})`, 'gi'));
        const petName = user.petName.split(new RegExp(`(${enteredInput})`, 'gi'));
        return (
          <div
            className="mx-[55px] mt-[20px] flex items-center"
            aria-hidden
            onClick={() => onClickUserHandler(user)}
          >
            <img
              className="mr-[12px] h-[39px] w-[39px] rounded-full"
              src={user.profile}
              alt="profile"
            />
            <div>
              <div className="">
                {nickname.map((part, index) =>
                  part === enteredInput ? (
                    <span key={index} className="font-medium text-[#7a7ccf]">
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </div>
              <div className="text-[12px] text-[#646566]">
                <span>
                  {petName.map((part, index) =>
                    part === enteredInput ? (
                      <span key={index} className="font-medium text-[#7a7ccf]">
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
                </span>
                {`/${user.yearOfPetAge}살 ${user.breedName}`}
              </div>
            </div>
          </div>
        );
      }),
    [userList],
  );

  // 멍플 자동완성
  const mungpleAutoComplete = useMemo(
    () =>
      option.map((cafe) => {
        const name = cafe.placeName.split(new RegExp(`(${enteredInput})`, 'gi'));
        const address = cafe.address.split(new RegExp(`(${enteredInput})`, 'gi'));
        return (
          <div
            className="mx-[55px] mt-[20px]"
            aria-hidden="true"
            onClick={() => onClickMungpleHandler(cafe)}
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

  // 최근 검색
  const recentPlace = useMemo(
    () =>
      recentSearch.map((cafe) => {
        return (
          <div
            className="search-auto-item"
            aria-hidden="true"
            onClick={() => onClickRecentHandler(cafe)}
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
              aria-hidden
              onClick={() => setSelectedTab('keyword')}
            >
              장소
            </div>
            <div
              className={`${
                selectedTab === 'user'
                  ? ' border-b-[3px] border-b-black text-black'
                  : 'text-[#646566]'
              } px-[3px]`}
              aria-hidden
              onClick={() => setSelectedTab('user')}
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
          <div className="search-recent">{recentPlace}</div>
        </div>
      )}
      {enteredInput.length > 0 && selectedTab === 'keyword' && (
        <div className="mt-[104px] w-full">
          <div>
            {isFocus && option.length > 0 && enteredInput.length > 0 && (
              <div className="search-auto">{mungpleAutoComplete}</div>
            )}
          </div>
          <div>
            {option.length > 0 && (
              <div className="mt-[20px] h-[3px] w-full bg-[#f6f6f6]" />
            )}
            {searchedKakaoPlace.map((place) => (
              <div
                className="mx-[55px] mt-[20px]"
                aria-hidden
                onClick={() =>
                  selectKakaoPlace(
                    new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
                  )
                }
              >
                <div className="text-[15px]">{place.place_name}</div>
                <div className="text-[12px] text-[#646566]">{place.address_name}</div>
              </div>
            ))}
            <div ref={placeRef}>&nbsp;</div>
          </div>
        </div>
      )}
      {selectedTab === 'user' && (
        <div className="mt-[104px] w-full">{searchedUserList}</div>
      )}
    </div>
  );
}

export default SearchBar;
