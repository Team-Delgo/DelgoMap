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
  const firstCert = (useLocation()?.state?.cert as any) || null; //내기록 앨범부분에서 다른강아지들 뭐할까? post 클릭시 해당 post 맨위로 끌어내리기 위해 설정
  const pageFrom = (useLocation()?.state?.from as any) || 'home'; //이전 페이지가 어디있는지 알려줌(router로 보낸 state가 없으면 home)
  const [pageSizeCount, setPageSizeCount] = useState(0); // 현재 load된 포스트사이즈 상태값(업데이트 페이지, 댓글 페이지 이동시 스크롤 유지를 위해)
  const { user } = useSelector((state: RootState) => state.persist.user);
  const { scroll, pageSize } = useSelector(
    //store에서 스크롤Y 높이와, 포스트사이즈 가져옴(스크롤 유지를 위해)
    (state: RootState) => state.persist.scroll.posts,
  );

  const dispatch = useDispatch();
  const { ref, inView } = useInView(); // 특정 요소가 뷰포트(viewport)에 감지해주는 훅(ref객체에 바인딩된 요소가 감지되면 inView가 true로 변환)
  const navigate = useNavigate();
  const mutation = useAnalyticsLogEvent(analytics, 'screen_view');

  // 무한 스크롤 api hook
  const {
    data, //api 응닶 데이터 값
    fetchNextPage, //다음 page(포스터) fetch호출해주는 함수
    refetch: certificationPostsFetch, //refetch 해주는 함수(좋아요하면 stale data를 fresh data로 갱신해줘야함)
    isLoading, //api 서버상태를 반환해주는 isLoading(데이터 fetching + 백그라운드 캐싱 fetching 할떄는 isFetching을 선언해서 사용해주면 됨)
  } = useInfiniteQuery(
    //무한 스크롤 쿼리관련설정
    GET_ALL_CERTIFICATION_DATA_LIST, //쿼리 키값 설정(constants 쿼리키 파일에 선언하고 참조하면서 사용)
    ({ pageParam = 0 }) =>
      getCertificationPostAll(
        pageParam, //페이지 번호(페이지네이션때 클릭한 페이지 숫자로 생각하면 편함)
        user.id,
        pageSize, //불러올 pageSize(인증글 사이즈)
        firstCert?.certificationId === undefined ? '' : firstCert?.certificationId,
      ),
    {
      getNextPageParam: (
        lastPage: any, //다음 page를 불러오는 함수
      ) =>
        // lastPage.last의 값이 존재하지 않으면 (즉, 마지막 페이지가 아니면) lastPage.nextPage` 값을 반환 아니면 undefined
        !lastPage?.last ? lastPage?.nextPage : undefined,
    },
  );

  // 컴포넌트가 마운트 될 때 analytics 이벤트를 기록
  useEffect(() => {
    mutation.mutate({
      params: {
        firebase_screen: 'FriendsCeritfications',
        firebase_screen_class: 'FriendsCeritficationsPage',
      },
    });
  }, []);

  //무한 스크롤 api로 데이터 fetch 할때마다 post 사이즈를 갱신해줌
  useEffect(() => {
    if (typeof data?.pages[0]?.content?.length === 'number') {
      setPageSizeCount(data?.pages[0]?.content?.length + pageSizeCount);
    }
  }, [data]);

  //isLoading간에 store에 저장된 scrollY를 적용해줌(디펜던시 배열에 isLoading을 빼면 그만큼 랜더링된 포스트가없어서 이전 스크롤이 그대로 유지가안됨)
  useEffect(() => {
    window.scroll(0, scroll);
    // console.log('data', data);
  }, [isLoading]);

  useEffect(() => {
    if (inView) fetchNextPage(); //스크롤이 페이지 하단에서 탐지되면 다음 페이지들 fetch (무한스크롤 적용)
  }, [inView]);

  //홈으로 이동하는 함수
  const moveToHomePage = useCallback(() => {
    //스크롤 상태값을 초기화해주고(홈->동네강아지 다시이동할때 스크롤이 적용되면 안되므로)
    dispatch(scrollActions.scrollInit());
    //이전페이지가 어디인지에 따라 분기처리해서 페이지 이동
    if (pageFrom === 'home' || pageFrom === 'homeCert') navigate(ROOT_PATH);
    else navigate(`${RECORD_PATH.PHOTO}/${user.id}`);
  }, []);

  //서버 상태가 loading 중이면 보여줄 컴포넌트
  if (isLoading) {
    return <DogLoading />;
  }

  return (
    <>
      <PageHeader
        title="동네 강아지"
        navigate={moveToHomePage}
        // isFixed
        isAbsolute={false}
        short={false}
      />
      <div className="certificationPostsPage">
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
    </>
  );
}

export default CertificationPostsPage;
