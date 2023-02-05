import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useAnalyticsLogEvent, useAnalyticsCustomLogEvent } from "@react-query-firebase/analytics";
import { useLocation, useNavigate } from "react-router-dom";
import useOnclickOutside from "react-cool-onclickoutside";
import Sheet from "react-modal-sheet";
import { useDispatch, useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import "./Photo.scss";
import UnderArrow from "../../../../common/icons/under-arrow-gray.svg";
import { Cert } from "../../../map/components/maptype";
import { getPhotoCount, getPhotoData } from "../../../../common/api/record";
import { RECORD_PATH } from "../../../../common/constants/path.const";
import { analytics } from "../../../../index";
import { scrollActions } from "../../../../redux/slice/scrollSlice";
import { RootState } from "../../../../redux/store";
import Plus from "../../../../common/icons/plus.svg";

function Photo() {
  const mutation = useAnalyticsLogEvent(analytics, "screen_view");
  const navigate = useNavigate();
  const certEvent = useAnalyticsCustomLogEvent(analytics, "album_cert");
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
  const [certCount, setCertCount] = useState(0);
  const [pageSizeFor, setPageSizeFor] = useState(pageSize);
  const [buttonIsClicked, setButtonIsClicked] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [categoryTab, setCategoryTab] = useState("전체");
  const [sortOption, setSortOption] = useState<boolean>(true);
  const [isLast, setLast] = useState(false);
  const dispatch = useDispatch();
  const location: any = useLocation();

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: "Album",
        firebase_screen_class: "AlbumPage",
      },
    });
    getTotalCount();
    if (location?.state?.from !== "home" && pageSizeFor === 1) {
      getPhotoDataList();
    }
    if (pageSizeFor > 1) {
      getPhotoDataList();
    }
    const handleScroll = () => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop >= offsetHeight) {
        setFetching(true);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const touchStartFunc = (e: any) => {
    setTouchStart(e.touches[0].clientX);
  };

  const touchEndFunc = (e: any) => {
    setTouchEnd(e.changedTouches[0].clientX);
  };

  useEffect(() => {
    if (touchStart - touchEnd > 200) {
      navigate(RECORD_PATH.CALENDAR, { state: "calendar" });
    }
  }, [touchEnd]);

  useEffect(() => {
    if (isFetching && !isLast) {
      getPhotoDataList();
    } else if (isLast) setFetching(true);
  }, [isFetching]);

  const getTotalCount = () => {
    getPhotoCount(
      userId,
      (response: AxiosResponse) => {
        setCertCount(response.data.data);
      },
      dispatch
    );
  };
  const changePhotoData = () => {
    getPhotoData(
      userId,
      "CA0000",
      0,
      6,
      sortOption,
      (response: AxiosResponse) => {
        const { data } = response;
        setPage(1);
        setPhotos(data.data.content);
        setLast(data.data.last);
        setPageSizeFor(1);
        setFetching(false);
      },
      dispatch
    );
  };

  useEffect(() => {
    changePhotoData();
  }, [sortOption]);

  useEffect(() => {
    if (!isLoading && pageSizeFor > 1 && photos.length >= pageSizeFor * 6) {
      window.scroll(0, scroll);
      setPageSizeFor(1);
    }
  }, [isLoading, photos]);

  const getPhotoDataList = () => {
    setIsLoading(true);
    getPhotoData(
      userId,
      "CA0000",
      page,
      pageSizeFor > 1 ? 6 * pageSizeFor : 6,
      sortOption,
      (response: AxiosResponse) => {
        const { data } = response;
        if (pageSizeFor > 1) {
          setPage(pageSizeFor);
        } else {
          setPage(page + 1);
        }
        setPhotos(photos.concat(data.data.content));
        setLast(data.data.last);
        setFetching(false);
      },
      dispatch
    );
    setIsLoading(false);
  };

  const noRecordContext = useMemo(
    () => (
      <div className="photo-nocert">
        <h4>기록이 없어요</h4>
        <span className="photo-nocert-guide">
          오른쪽 하단
          <div className="photo-nocert-guide-icon">
            <img className="photo-nocert-guide-icon-img" src={Plus} alt="plus" />
          </div>
          를 눌러 기록해 보세요
        </span>
      </div>
    ),
    []
  );

  const otherDogsFeed = useMemo(() => {
    return (
      <div className="photo-others">
        <div className="photo-others-header">
          <h5>다른 강아지들은 뭐 할까?</h5>
          <span className="photo-others-more">더보기</span>
        </div>
        <div className="photo-others-photo"></div>
      </div>
    );
  }, []);

  const photoContext = useMemo(
    () =>
      photos.map((photo) => {
        const photoClickHandler = () => {
          dispatch(scrollActions.photosScroll({ scroll: window.scrollY, pageSize: page }));
          certEvent.mutate();
          navigate("/certs", { state: { certifications: [photo], pageFrom: RECORD_PATH.PHOTO } });
        };

        return (
          <img
            className="photo-wrapper-img"
            src={photo.photoUrl}
            alt="cert"
            aria-hidden="true"
            onClick={photoClickHandler}
          />
        );
      }),
    [photos]
  );

  if (photoContext.length % 2 === 0) {
    photoContext.concat(<div className="photo-fake" />);
  }

  return (
    <div className="photo">
      <div className="photo-history">
        <div className="photo-history-title">{certCount}장의 사진</div>
        <div className="photo-history-select">
          <div
            className="photo-history-select-sort"
            aria-hidden="true"
            onClick={() => {
              setButtonIsClicked(!buttonIsClicked);
            }}
          >
            {sortOption ? "최신순" : "오래된순"}
            <img src={UnderArrow} alt="arrow" />
          </div>
        </div>
      </div>

      <div className="photo-wrapper" onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc}>
        {photos.length > 0 ? photoContext : noRecordContext}
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
                className={classNames("photo-sort-option-item", { selected: sortOption })}
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
                className={classNames("photo-sort-option-item", { selected: !sortOption })}
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