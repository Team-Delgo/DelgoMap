import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import classNames from 'classnames';
import { useInView } from 'react-intersection-observer';
import {
  useAnalyticsLogEvent,
  useAnalyticsCustomLogEvent,
} from '@react-query-firebase/analytics';
import { useNavigate } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import Sheet from 'react-modal-sheet';
import { useDispatch, useSelector } from 'react-redux';
import './Photo.scss';
import { Cert } from '../../../map/index.types';
import { getMyPhotoData, getOtherPhotoData } from '../../../../common/api/record';
import { POSTS_PATH, RECORD_PATH } from '../../../../common/constants/path.const';
import { analytics } from '../../../../index';
import { scrollActions } from '../../../../redux/slice/scrollSlice';
import { RootState } from '../../../../redux/store';
import Plus from '../../../../common/icons/plus.svg';
import { getFiveOtherDogsCert } from '../../../../common/api/certification';

function Photo() {
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');
  const navigate = useNavigate();
  const certEvent = useAnalyticsCustomLogEvent(analytics, 'album_cert');
  const splitUrl = window.location.href.split('/');
  const userId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const myId = useSelector((state: RootState) => state.persist.user.user.id);
  const { pageSize, scroll } = useSelector(
    (state: RootState) => state.persist.scroll.photos,
  );
  const sheetRef = useOnclickOutside(() => {
    setButtonIsClicked(false);
  });
  const [page, setPage] = useState<number>(0);
  const [buttonIsClicked, setButtonIsClicked] = useState(false);
  const [sortOption, setSortOption] = useState<boolean>(true);
  const dispatch = useDispatch();
  const { ref, inView } = useInView();

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'Album',
        firebase_screen_class: 'AlbumPage',
      },
    });
  }, []);

  const {
    data: photos,
    isFetched: isPhotoFetched,
    fetchNextPage,
  } = useInfiniteQuery(
    ['getCertPhotos', userId],
    ({ pageParam = 0 }) => {
      if (userId === myId) {
        return getMyPhotoData(userId, 'CA0000', pageParam, 15, sortOption);
      } else {
        return getOtherPhotoData(userId, 'CA0000', pageParam, 15, sortOption);
      }
    },
    {
      getNextPageParam: (last) => (!last.last ? last.number + 1 : undefined),
    },
  );
  console.log(photos);
  const { data: otherDogsCerts, isLoading: otherDogsCertsLoading } = useQuery(
    ['getFiveOtherDogsCert', userId],
    () => getFiveOtherDogsCert(userId, 5),
    {
      enabled: photos?.pages[0].content.length === 0,
    },
  );

  const navigateToOthers = (cert: Cert) => {
    navigate(POSTS_PATH, { state: { cert, from: 'photo' } });
  };

  const navigateNotSelect = () => {
    navigate(POSTS_PATH, { state: { cert: null, from: 'photo-not' } });
  };

  const noRecordContext = useMemo(() => {
    const imgs =
      otherDogsCerts &&
      otherDogsCerts.map((o) => {
        return (
          <img
            src={o.photoUrl}
            alt="others"
            key={o.certificationId}
            onClick={() => navigateToOthers(o)}
            aria-hidden
          />
        );
      });
    return (
      isPhotoFetched && (
        <div className="photo-nocert">
          <h4>기록이 없어요</h4>
          <span className="photo-nocert-guide">
            하단
            <div className="photo-nocert-guide-icon">
              <img className="photo-nocert-guide-icon-img" src={Plus} alt="plus" />
            </div>
            를 눌러 기록해 보세요
          </span>
          <div className="photo-others-divider" />
          <div className="photo-others-header">
            <h5>다른 강아지들은 뭐 할까?</h5>
            <span className="photo-others-more" aria-hidden onClick={navigateNotSelect}>
              더보기
            </span>
          </div>
          <div className="photo-others-photo">{imgs}</div>
        </div>
      )
    );
  }, [photos, otherDogsCerts]);

  const photoContext = photos?.pages.map((photo) => (
    <>
      {photo.content.map((cert) => {
        const photoClickHandler = () => {
          dispatch(
            scrollActions.photosScroll({ scroll: window.scrollY, pageSize: page }),
          );
          certEvent.mutate();
          navigate('/certs', {
            state: {
              info: {
                certId: cert.certificationId,
                userId,
                date: cert.registDt,
              },
              from: RECORD_PATH.PHOTO,
            },
          });
        };

        return (
          <img
            className="photo-wrapper-img"
            src={cert.photos[0]}
            alt="cert"
            aria-hidden="true"
            key={cert.certificationId}
            onClick={photoClickHandler}
          />
        );
      })}
    </>
  ));

  if (photoContext && photoContext.length % 2 === 0) {
    photoContext.concat(<div className="photo-fake" />);
  }

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  return (
    <div className="photo">
      {/* <div className="photo-history">
        {photos && (
          <div className="photo-history-title">{photos.pages[0].totalCount}장의 사진</div>
        )}
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
      </div> */}

      <div className="photo-wrapper">
        {photos && photos.pages[0].content.length > 0 ? photoContext : noRecordContext}
      </div>
      <div ref={ref}>&nbsp;</div>
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
            <div className="photo-sort-option" ref={sheetRef}>
              <div
                className={classNames('photo-sort-option-item', {
                  selected: sortOption,
                })}
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
                className={classNames('photo-sort-option-item', {
                  selected: !sortOption,
                })}
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
