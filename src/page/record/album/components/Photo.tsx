import React, { useEffect, useRef, useState, lazy } from 'react';
import classNames from 'classnames';
import { useAnalyticsLogEvent, useAnalyticsCustomLogEvent } from '@react-query-firebase/analytics';
import { useLocation, useNavigate } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import Sheet from 'react-modal-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import FooterNavigation from '../../../../components/FooterNavigation';
import RecordHeader from '../../../../components/RecordHeader';
import './Photo.scss';
import UnderArrow from '../../../../common/icons/under-arrow-gray.svg';
import { Cert } from '../../../map/components/maptype';
import { getPhotoData } from '../../../../common/api/record';
import { RECORD_PATH } from '../../../../common/constants/path.const';
import { analytics } from '../../../../index';
import { scrollActions } from '../../../../redux/scrollSlice';
import { RootState } from '../../../../redux/store';

function Photo() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const certEvent = useAnalyticsCustomLogEvent(analytics, 'album_cert');
  const userId = useSelector((state: RootState) => state.persist.user.user.id);
  const { pageSize, scroll } = useSelector((state: RootState) => state.persist.scroll.photos);
  const ref = useOnclickOutside(() => {
    setButtonIsClicked(false);
  });
  const [photos, setPhotos] = useState<Cert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [pageSizeFor, setPageSizeFor] = useState(pageSize);
  const [buttonIsClicked, setButtonIsClicked] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [categoryTab, setCategoryTab] = useState('전체');
  const [sortOption, setSortOption] = useState<boolean>(true);
  const [isLast, setLast] = useState(false);
  const dispatch = useDispatch();
  const location: any = useLocation();

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'Album',
        firebase_screen_class: 'AlbumPage',
      },
    });
    if (location?.state?.from !== 'home' && pageSizeFor === 1) {
      getPhotoDataList();
    }
    if(pageSizeFor > 1){
      getPhotoDataList();
    }
    const handleScroll = () => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop >= offsetHeight) {
        setFetching(true);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const touchStartFunc = (e: any) => {
    setTouchStart(e.touches[0].clientX);
  };

  const touchEndFunc = (e: any) => {
    setTouchEnd(e.changedTouches[0].clientX);
  };
  
  useEffect(() => {
    if (touchStart - touchEnd > 200) {
      navigate(RECORD_PATH.CALENDAR, { state: 'calendar' });
    }
  }, [touchEnd]);

  useEffect(() => {
    if (isFetching && !isLast) {
      getPhotoDataList();
    }
    else if (isLast) setFetching(true);
  }, [isFetching]);

  const changePhotoData = () => {
    getPhotoData(
      userId,
      'CA0000',
      0,
      6,
      sortOption,
      (response: AxiosResponse) => {
        const { data } = response;
        setPage(1);
        setPhotos(data.data.content);
        setLast(data.data.last);
        setFetching(false);
      },
      dispatch,
    );
  };

  useEffect(() => {
    changePhotoData();
  }, [sortOption]);

  useEffect(() => {
    if (!isLoading && pageSizeFor > 1 && photos.length >= pageSizeFor*6) {
      window.scroll(0, scroll);
      setPageSizeFor(1);
    }
  }, [isLoading, photos]);

  const getPhotoDataList = () => {
    setIsLoading(true);
    getPhotoData(
      userId,
      'CA0000',
      page,
      pageSizeFor > 1 ? 6 * pageSizeFor : 6,
      sortOption,
      (response: AxiosResponse) => {
        const { data } = response;
        console.log(data);
        if (pageSizeFor > 1) {
          setPage(pageSizeFor);
        } else {
          setPage(page + 1);
        }
        setPhotos(photos.concat(data.data.content));
        setLast(data.data.last);
        setFetching(false);
      },
      dispatch,
    );
    setIsLoading(false);
  };

  const photoContext = photos.map((photo) => {
    const photoClickHandler = () => {
      dispatch(scrollActions.photosScroll({ scroll: window.scrollY, pageSize: page }));
      certEvent.mutate();
      navigate('/certs', { state: { certifications: [photo], pageFrom: RECORD_PATH.PHOTO } });
    };

    return <img src={photo.photoUrl} alt="cert" aria-hidden="true" onClick={photoClickHandler} />;
  });
  if (photoContext.length % 2 === 0) {
    photoContext.concat(<div className="photo-fake" />);
  }

  return (
    <div className="photo">
      <div className="photo-history">
        <div className="photo-history-title">{categoryTab}기록</div>
        <div className="photo-history-select">
          <div
            className="photo-history-select-sort"
            aria-hidden="true"
            onClick={() => {
              setButtonIsClicked(!buttonIsClicked);
            }}
          >
            {sortOption ? '최신순' : '오래된순'}
            <img src={UnderArrow} alt="arrow" />
          </div>
        </div>
      </div>
      

      <div className="photo-wrapper" onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc}>
        {photoContext}
      </div>
      <Sheet
        className="confirm-bottom-sheet-container"
        isOpen={buttonIsClicked}
        disableDrag
        onClose={() => {
          setButtonIsClicked(false);
        }}
        snapPoints={[160, 160, 160, 160]}
      >
        <Sheet.Container>
          <Sheet.Content>
            <div className="photo-sort-option" ref={ref}>
              <div
                className={classNames('photo-sort-option-item', { selected: sortOption })}
                aria-hidden="true"
                onClick={() => {
                  setSortOption(true);
                  setButtonIsClicked(false);
                }}
              >
                최신순
              </div>
              <div className="photo-sort-option-devider" />
              <div
                className={classNames('photo-sort-option-item', { selected: !sortOption })}
                aria-hidden="true"
                onClick={() => {
                  setSortOption(false);
                  setButtonIsClicked(false);
                }}
              >
                오래된순
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
}

export default Photo;
