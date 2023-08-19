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
import DogLoading from '../../common/utils/BallLoading';
import { analytics } from '../../index';
import { RECORD_PATH, ROOT_PATH } from '../../common/constants/path.const';
import { scrollActions } from '../../redux/slice/scrollSlice';
import { GET_ALL_CERTIFICATION_DATA_LIST } from '../../common/constants/queryKey.const';
import { postType } from '../../common/types/post';
import PageHeader from '../../components/PageHeader';

function CertificationPostsPage() {
  const firstCert = (useLocation()?.state?.cert as any) || null;
  const pageFrom = (useLocation()?.state?.from as any) || 'home';
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
      getCertificationPostAll(
        pageParam,
        user.id,
        pageSize,
        firstCert?.certificationId === undefined ? '' : firstCert?.certificationId,
      ),
    {
      getNextPageParam: (lastPage: any) =>
        !lastPage?.last ? lastPage?.nextPage : undefined,
    },
  );
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
    if (pageFrom === 'home' || pageFrom === 'homeCert') navigate(ROOT_PATH);
    else navigate(`${RECORD_PATH.PHOTO}/${user.id}`);
  }, []);

  if (isLoading) {
    return <DogLoading />;
  }

  return (
    <div className="certificationPostsPage">
      <PageHeader
        title="동네 강아지"
        navigate={moveToHomePage}
        isFixed
        isAbsolute={false}
        short={false}
      />
      {pageFrom === 'photo' || pageFrom === 'homeCert' ? (
        <CertificationPost
          post={firstCert}
          certificationPostsFetch={certificationPostsFetch}
          pageSize={pageSizeCount}
        />
      ) : null}
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
