import React, { useState, useRef, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import regions, { regionType, placeType, GetRegion } from './region';
import './RegionSelector.scss';
import RightArrow from '../../../../common/icons/right-arrow.svg';
import { Region } from './UserInfo';
import { changeGeoCode } from '../../../../common/api/myaccount';
import { RootState } from '../../../../redux/store';
import { userActions } from '../../../../redux/slice/userSlice';

interface selectedRegion {
  index: number;
  selected: regionType;
}
interface selectedPlace {
  index: number;
  selected: placeType;
}

function RegionSelector(props: {
  change: (r: string, rg: Region) => void;
  close: (comment: string) => void;
  list: regionType[];
  rIndex: number | undefined;
  pIndex: number | undefined;
  isChange: boolean;
}) {
  const { change, close, list, rIndex, pIndex, isChange } = props;
  const [regionList, setRegionList] = useState<regionType[]>([]);
  const email = useSelector((state: RootState) => state.persist.user.user.email);
  const [index, setIndex] = useState({ rIndex, pIndex });
  const [selectedRegion, setSelectedRegion] = useState<selectedRegion>({
    index: index.rIndex || 3,
    selected: list[index.rIndex || 3],
  });
  const [selectedPlace, setSelectedPlace] = useState<selectedPlace>({
    index: index.pIndex || 3,
    selected: selectedRegion.selected.places[index.pIndex || 3],
  });
  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const getRegionData = async () => {
    const response = await GetRegion();
    setRegionList(response);
  };

  useEffect(() => {
    getRegionData();
  }, []);

  useEffect(() => {
    if (index.rIndex && index.pIndex) {
      if (yearRef.current) {
        yearRef.current.scrollTop = 40 * (index.rIndex - 3);
      }
      if (monthRef.current) {
        monthRef.current.scrollTop = 40 * (index.pIndex - 3);
      }
      setIndex({ rIndex: 0, pIndex: 0 });
    } else if (!index.pIndex) {
      if (yearRef.current) {
        if (monthRef.current) {
          monthRef.current.scrollTop = 0;
        }
      }
    }
  }, [selectedRegion]);

  useEffect(() => {
    console.log(selectedRegion.selected.region);
    if (selectedRegion.selected.region === '세종특별시') {
      change(`${selectedRegion.selected.region}`, {
        indexRegion: selectedRegion.index,
        indexPlace: selectedPlace.index,
        region: selectedRegion.selected.region,
        place: selectedPlace.selected.place,
        pGeoCode: selectedRegion.selected.code,
        geoCode: selectedPlace.selected.code,
      });
    } else {
      change(`${selectedRegion.selected.region}-${selectedPlace.selected.place}`, {
        indexRegion: selectedRegion.index,
        indexPlace: selectedPlace.index,
        region: selectedRegion.selected.region,
        place: selectedPlace.selected.place,
        pGeoCode: selectedRegion.selected.code,
        geoCode: selectedPlace.selected.code,
      });
    }
  }, [selectedRegion, selectedPlace]);

  let key = 0;
  const regionContext = list.map((region) => {
    key += 1;
    if (region.code < 6)
      return (
        <div className="h-[40px] text-[white]" key={`dummyRegion${key}`}>
          .
        </div>
      );
    return (
      <div
        key={region.code}
        className={`h-[40px] ${
          selectedRegion.selected === region ? 'font-normal text-[#3e382f]' : 'text-[#c4c4c4]'
        }  `}
      >
        {region.region}
      </div>
    );
  });

  const placeContext = selectedRegion.selected.places.map((place) => {
    key += 1;
    if (place.code < 6)
      return (
        <div className="h-[40px] text-[white]" key={`dummyRegion${key}`}>
          .
        </div>
      );
    return (
      <div
        key={place.code}
        className={`h-[40px] ${
          selectedPlace.selected === place ? 'font-normal text-[#3e382f]' : 'text-[#c4c4c4]'
        } `}
      >
        {place.place}
      </div>
    );
  });

  const yearScrollHandler = () => {
    if (yearRef.current) {
      const { scrollTop } = yearRef.current;
      const index = Math.round(scrollTop / 40) + 3;
      if (index !== selectedRegion.index) {
        setSelectedRegion({ index, selected: list[index] });
        setSelectedPlace({ index: 3, selected: list[index].places[3] });
      }
    }
  };

  const monthScrollHandler = () => {
    if (monthRef.current) {
      const { scrollTop } = monthRef.current;
      const index = Math.round(scrollTop / 40) + 3;
      setSelectedPlace({ index, selected: selectedRegion.selected.places[index] });
    }
  };

  const buttonClickHandler = () => {
    if (isChange) {
      changeGeoCode(
        email,
        selectedPlace.selected.code.toString(),
        selectedRegion.selected.code.toString(),
        (response: AxiosResponse) => {
          console.log(response);
        },
        dispatch,
      );
      dispatch(
        userActions.changeGeoCode({
          address: `${selectedRegion.selected.region}-${selectedPlace.selected.place}`,
          geoCode: selectedPlace.selected.code,
          pGeoCode: selectedRegion.selected.code,
        }),
      );
      close('지역이 설정되었습니다.');
    } else {
      close('');
    }
  };

  return (
    <div className="flex h-[360px] w-[335px] flex-col justify-center rounded-[5px] bg-white">
      <div className="z-10 flex items-center justify-center bg-white text-center rounded-[5px] text-[18px] font-light">
        <div
          className="h-[280px] w-[120px] overflow-scroll scrollbar-none"
          ref={yearRef}
          onScroll={yearScrollHandler}
        >
          {regionContext}
        </div>
        <div className="h-[60%] w-[0px] bg-[#8a8a8a]" />
        <div
          className="h-[280px] w-[120px] overflow-scroll scrollbar-none"
          ref={monthRef}
          onScroll={monthScrollHandler}
        >
          {placeContext}
        </div>
      </div>
      <div className="flex w-[100%] justify-end">
        <button
          type="button"
          onClick={buttonClickHandler}
          className="items m-5 flex justify-center rounded-[42px] bg-[#3f3f3f] px-[24px] py-[12px] text-xs font-medium leading-[150%] text-white"
        >
          <div className="mr-[7px]">다음</div>
          <img src={RightArrow} alt="right-arrow" />
        </button>
      </div>
    </div>
  );
}

export default RegionSelector;
