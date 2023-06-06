import React, { ReactNode, useState, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { getDetailPageReviews } from '../../../../common/api/detail';
import { RootState } from '../../../../redux/store';
import { postType } from '../../../../common/types/post';
import CertificationPost from '../../../../components/CertificationPost';

interface Props {
  mungpleId: number;
}

function DetailReview({ mungpleId }: Props) {
  const user = useSelector((state: RootState) => state.persist.user.user);
  const [pageSizeCount, setPageSizeCount] = useState(0);
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    refetch: certificationPostsFetch,
    isLoading,
  } = useInfiniteQuery(
    ['getDetailPageReviews', mungpleId],
    ({ pageParam = 0 }) => getDetailPageReviews(pageParam, user.id, mungpleId, 4),
    {
      getNextPageParam: (lastPage) =>
        lastPage.last ? undefined : lastPage.number + 1,
    },
  );

  useEffect(()=>{
    if(inView) fetchNextPage();
  },[inView]);

  return (
    <div className="detail-review">
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

export default DetailReview;
