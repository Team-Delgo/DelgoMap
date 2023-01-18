import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import './Calendar.scss';
import { getCalendarData } from '../../../../common/api/record';
import { Cert } from '../../../map/components/maptype';
import { DateType } from './calendarType';
import { RECORD_PATH } from '../../../../common/constants/path.const';
import { RootState } from '../../../../redux/store';
import { scrollActions } from '../../../../redux/slice/scrollSlice';
import { analytics } from "../../../../index";

function Calender() {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const scroll = useSelector((state: RootState) => state.persist.scroll.calendar.scroll);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(scroll);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dateList, setDateList] = useState<DateType[]>([]);
  const certEvent = useAnalyticsCustomLogEvent(analytics, "calendar_cert");
  const getNextYear = (currentMonth: number, currentYear: number, add: number) => {
    if (currentMonth + add > 12) {
      return currentYear + 1;
    }
    return currentYear;
  };

  const touchStartFunc = (e: any) => {
    // e.preventDefault();
    setTouchStart(e.touches[0].clientX);
  };

  const touchEndFunc = (e: any) => {
    // e.preventDefault();
    setTouchEnd(e.changedTouches[0].clientX);
  };

  useEffect(() => {
    getCalendarData(
      userId,
      (response: AxiosResponse) => {
        const { code, data } = response.data;
        setDateList(data);
      },
      dispatch,
    );
  }, []);

  useEffect(() => {
    if (touchStart - touchEnd > 200) {
      navigate(RECORD_PATH.ACHIEVE, { state: 'achieve' });
    }
    else if (touchStart - touchEnd < - 200) {
      navigate(RECORD_PATH.PHOTO, { state: 'photo' });
    }
  }, [touchEnd]);

  useEffect(() => {
    if (scroll === 0) {
      scrollRef.current?.scrollIntoView({ block: 'end' });
    }
    else {
      window.scroll(0, scrollY);
    }
  }, [dateList]);


  const getDateContext = (prev: number) => {
    const date = new Date();

    let currentYear = date.getFullYear();
    let currentMonth: string | number = date.getMonth() + prev;
    if (currentMonth <= -1) {
      currentMonth = 12 + prev + date.getMonth();
      currentYear -= 1;
    }

    currentYear = getNextYear(currentMonth, currentYear, prev);

    const prevLast = new Date(currentYear, currentMonth, 0);
    const thisLast = new Date(currentYear, currentMonth + 1, 0);

    const prevLastDate = prevLast.getDate();
    const prevLastDay = prevLast.getDay();

    const thisLastDate = thisLast.getDate();
    const thisLastDay = thisLast.getDay();

    const thisDates: number[] = [];
    const prevDates: number[] = [];
    const nextDates: number[] = [];

    for (let i = 1; i <= thisLastDate; i += 1) {
      thisDates.push(i);
    }

    if (prevLastDay !== 6) {
      for (let i = 0; i < prevLastDay + 1; i += 1) {
        prevDates.unshift(prevLastDate - i);
      }
    }

    for (let i = 1; i < 7 - thisLastDay; i += 1) {
      nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(thisLastDate);
    currentMonth += 1;

    if (currentMonth < 10) {
      currentMonth = currentMonth.toString();
      currentMonth = `0${currentMonth}`;
    }

    const datesElement = dates.map((date, i) => {
      let rdate: string | number = date;
      if (date < 10) {
        rdate = date.toString();
        rdate = `0${date}`;
      }
      const condition = i >= firstDateIndex && i <= lastDateIndex;
      const id = condition ? `${currentYear}-${currentMonth}-${rdate}` : `f${currentYear}-${currentMonth}-${rdate}`;

      let achieve = false;
      let isCertificated = false;
      let imageSrc;
      let certification: Cert[];
      dateList.forEach((date) => {
        if (date.date === id) {
          isCertificated = true;
          certification = date.dateList;
          imageSrc = date.dateList[0].photoUrl;
          achieve = date.isAchievements;
        }
      });

      return (
        <div
          key={id}
          className={classNames('date-day', { able: condition, circle: isCertificated })}
          id={id}
          aria-hidden="true"
          onClick={
            isCertificated
              ? () => {
                certEvent.mutate();
                dispatch(scrollActions.calendarScroll({ scroll: window.scrollY }));
                navigate('/certs', { state: { certifications: certification, pageFrom: RECORD_PATH.CALENDAR } })
              }
              : undefined
          }
        >
          {date}
          {achieve && <div className='date-day-achieve' />}
          {isCertificated && <img src={imageSrc} alt="park" className="date-day-after" />}
        </div>
      );
    });

    return { datesElement, currentYear, currentMonth };
  };

  const tempUserSignDate = '2022-05-01';

  const getMonthDiff = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const startYear = new Date(tempUserSignDate).getFullYear();
    const startMonth = new Date(tempUserSignDate).getMonth();

    return (currentYear - startYear) * 12 + (currentMonth - startMonth);
  };

  const diff = getMonthDiff() + 1;

  const monthArray: number[] = [];

  for (let i = 0; i < diff; i += 1) {
    monthArray.push(-i);
  }

  const datesElement = monthArray.map((i) => {
    const element = getDateContext(-(monthArray.length + i) + 1);
    const weekDay = (
      <div className="day-header">
        <div className="day sun">일</div>
        <div className="day">월</div>
        <div className="day">화</div>
        <div className="day">수</div>
        <div className="day">목</div>
        <div className="day">금</div>
        <div className="day">토</div>
      </div>
    );
    return (
      <>
        <div className="current-month">{`${element.currentYear}.${element.currentMonth}`}</div>
        {weekDay}
        <div className="date">{element.datesElement}</div>
      </>
    );
  });

  return (
    <div className="calender">
      <div className="date-wrapper" ref={scrollRef} onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc}>
        {datesElement}
      </div>
    </div>
  );
}

export default Calender;
