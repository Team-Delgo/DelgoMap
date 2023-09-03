import { useInView } from 'react-intersection-observer';
import { Mungple } from 'page/map/index.types';
import { useEffect, useState } from 'react';

interface Props {
  searchFromKakao: () => void;
  mungpleSearchResult: Mungple[];
  kakaoSearchResult: kakao.maps.services.PlacesSearchResultItem[];
  userSearchResult: undefined;
}

const SearchMore = ({
  searchFromKakao,
  mungpleSearchResult,
  kakaoSearchResult,
  userSearchResult,
}: Props) => {
  const { ref, inView } = useInView();
  const [selectedTab, setSelectedTab] = useState<'keyword' | 'user'>('keyword');

  useEffect(() => {
    if (inView) searchFromKakao();
  }, [inView]);

  return (
    <div className="w-full">
      <div className="flex justify-evenly">
        <div
          className={`${
            selectedTab === 'keyword'
              ? ' border-b-[3px] border-b-black text-black'
              : 'text-[#646566]'
          } px-[3px]`}
        >
          키워드
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
      <div></div>
      <div>
        {kakaoSearchResult.map((place) => (
          <div className="px-[55px] mt-[20px]">
            <div className="text-[15px]">{place.place_name}</div>
            <div className="text-[12px] text-[#646566]">{place.address_name}</div>
          </div>
        ))}
        <div ref={ref}>&nbsp;</div>
      </div>
    </div>
  );
};

export default SearchMore;
