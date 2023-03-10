/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useEffect, useState } from 'react';
import { useAnalyticsLogEvent } from '@react-query-firebase/analytics';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getCertificationPostAll } from '../../common/api/certification';
import './CertificationPostsPage.scss';
import { RootState } from '../../redux/store';
import CertificationPost from '../../components/CertificationPost';
import Loading from '../../common/utils/Loading';
import PrevArrow from '../../common/icons/prev-arrow-black.svg';
import { analytics } from '../../index';
import { ROOT_PATH } from '../../common/constants/path.const';
import { scrollActions } from '../../redux/slice/scrollSlice';
import { GET_ALL_CERTIFICATION_DATA_LIST } from '../../common/constants/queryKey.const';
import { postType } from '../../common/types/post';


function CertificationPostsPage() {
  const pageFrom = (useLocation().state as any) || 'home';
  const [pageSizeCount, setPageSizeCount] = useState(0);
  const { user } = useSelector((state: RootState) => state.persist.user);
  const { scroll, pageSize } = useSelector(
    (state: RootState) => state.persist.scroll.posts,
  );

  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  const {
    data,
    fetchNextPage,
    refetch: certificationPostsFetch,
    isLoading,
  } = useInfiniteQuery(
    GET_ALL_CERTIFICATION_DATA_LIST,
    ({ pageParam = 0 }) =>
      getCertificationPostAll(pageParam, user.id, pageSize, dispatch),
    {
      getNextPageParam: (lastPage: any) =>
        !lastPage?.last ? lastPage?.nextPage : undefined,
    },
  );

  console.log('data',data)

  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'FriendsCeritfications',
        firebase_screen_class: 'FriendsCeritficationsPage',
      },
    });
  }, []);

  useEffect(() => {
    if (typeof data?.pages[0]?.content?.length === 'number') {
      setPageSizeCount(data?.pages[0]?.content?.length + pageSizeCount);
    }
  }, [data]);

  useEffect(() => {
    window.scroll(0, scroll);
  }, [isLoading]);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  const moveToHomePage = useCallback(() => {
    dispatch(scrollActions.scrollInit());
    navigate(ROOT_PATH);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="certificationPostsPage">
      <div className="certificationPostsPage-header">
        <img src={PrevArrow} alt="back" aria-hidden="true" onClick={moveToHomePage} />
        <div className="certificationPostsPage-header-text">?????? ?????????</div>
      </div>
      {data?.pages?.map((page) => (
        <>
          {page?.content?.map((post: postType) => (
            <CertificationPost
              post={post}
              certificationPostsFetch={certificationPostsFetch}
              pageSize={pageSizeCount}
            />
          ))}
        </>
      ))}
      <div ref={ref}>&nbsp;</div>
    </div>
  );
}

export default CertificationPostsPage;
