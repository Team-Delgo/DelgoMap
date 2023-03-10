import React, {  useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { CAMERA_PATH } from '../../../common/constants/path.const';
import { uploadAction } from '../../../redux/slice/uploadSlice';
import { CACHE_TIME, GET_CERTIFICATION_DATA_COUNT, STALE_TIME } from '../../../common/constants/queryKey.const';
// import { getCertificationDataCount } from '../../../common/api/certification'
// import { useErrorHandlers } from '../../../common/api/useErrorHandlers';
import { RootState } from '../../../redux/store';

function CaptureImgRecord() {
  const [selectedCategory, setSelectCategory] = useState('');
  const { user } = useSelector((state: RootState) => state.persist.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryRef = useRef<any>();

  // const { isLoading: getCertificationDataCountIsLoading, data: certificationDataCount } = useQuery(
  //   GET_CERTIFICATION_DATA_COUNT,
  //   () => getCertificationDataCount(user.id),
  //   {
  //     cacheTime: CACHE_TIME,
  //     staleTime: STALE_TIME,
  //     // onError: (error: any) => {
  //     //   useErrorHandlers(dispatch, error);
  //     // },
  //   },
  // );

  const moveToCategoryLeftScroll = (category: string) => (e: React.MouseEvent) => {
    setSelectCategory(category);
    categoryRef.current.scrollTo({
      left: categoryRef.current.scrollLeft - categoryRef.current.offsetWidth,
      behavior: 'smooth',
    });
    setTimeout(() => {
      dispatch(uploadAction.setCategory({ category }));
      navigate(CAMERA_PATH.LOCATION);
    }, 800);
  };

  const moveToCategoryRightScroll = (category: string) => (e: React.MouseEvent) => {
    setSelectCategory(category);
    categoryRef.current.scrollTo({
      left: categoryRef.current.offsetWidth,
      behavior: 'smooth',
    });
    setTimeout(() => {
      dispatch(uploadAction.setCategory({ category }));
      navigate(CAMERA_PATH.LOCATION);
    }, 800);
  };

  return (
    <div>123</div>
    // <div className="capture-img-record">
    //   <header className="capture-img-record-header">?????? ????????????????</header>
    //   <body className="capture-img-record-body" ref={categoryRef}>
    //     <div className="capture-img-record-body-walk" aria-hidden="true" onClick={moveToCategoryLeftScroll('??????')}>
    //       {/* <img
    //         src={Walk}
    //         alt="category-img"
    //         className={selectedCategory === '??????' ? 'capture-img-record-body-walk-img-active' : 'capture-img-record-body-walk-img'}
    //       /> */}
    //       <div className="capture-img-record-body-walk-count">{certificationDataCount?.data.??????}</div>
    //     </div>
    //     <div className="capture-img-record-body-cafe" aria-hidden="true" onClick={moveToCategoryLeftScroll('??????')}>
    //       {/* <img
    //         src={Cafe}
    //         alt="category-img"
    //         className={selectedCategory === '??????' ? 'capture-img-record-body-cafe-img-active' : 'capture-img-record-body-cafe-img'}
    //       /> */}
    //       <div className="capture-img-record-body-cafe-count">{certificationDataCount?.data.??????}</div>
    //     </div>
    //     <div className="capture-img-record-body-restaurant" aria-hidden="true" onClick={moveToCategoryLeftScroll('??????')}>
    //       {/* <img
    //         src={Restorant}
    //         alt="category-img"
    //         className={
    //           selectedCategory === '??????' ? 'capture-img-record-body-restaurant-img-active' : 'capture-img-record-body-restaurant-img'
    //         }
    //       /> */}
    //       <div className="capture-img-record-body-restaurant-count">{certificationDataCount?.data.??????}</div>
    //     </div>
    //     <div className="capture-img-record-body-bath" aria-hidden="true" onClick={moveToCategoryLeftScroll('??????')}>
    //       {/* <img
    //         src={Bath}
    //         alt="category-img"
    //         className={selectedCategory === '??????' ? 'capture-img-record-body-bath-img-active' : 'capture-img-record-body-bath-img'}
    //       /> */}
    //       <div className="capture-img-record-body-bath-count">{certificationDataCount?.data.??????}</div>
    //     </div>
    //     <div className="capture-img-record-body-beauty" aria-hidden="true" onClick={moveToCategoryRightScroll('??????')}>
    //       {/* <img
    //         src={Beauty}
    //         alt="category-img"
    //         className={selectedCategory === '??????' ? 'capture-img-record-body-beauty-img-active' : 'capture-img-record-body-beauty-img'}
    //       /> */}
    //       <div className="capture-img-record-body-beauty-count">{certificationDataCount?.data.??????}</div>
    //     </div>
    //     <div className="capture-img-record-body-hospital" aria-hidden="true" onClick={moveToCategoryRightScroll('??????')}>
    //       {/* <img
    //         src={Hospital}
    //         alt="category-img"
    //         className={selectedCategory === '??????' ? 'capture-img-record-body-hospital-img-active' : 'capture-img-record-body-hospital-img'}
    //       /> */}
    //       <div className="capture-img-record-body-hospital-count">{certificationDataCount?.data.??????}</div>
    //     </div>
    //     <div className="capture-img-record-body-etc" aria-hidden="true" onClick={moveToCategoryRightScroll('??????')}>
    //       {/* <img
    //         src={Etc}
    //         alt="category-img"
    //         className={selectedCategory === '??????' ? 'capture-img-record-body-etc-img-active' : 'capture-img-record-body-etc-img'}
    //       /> */}
    //       <div className="capture-img-record-body-etc-count">{certificationDataCount?.data.??????}</div>
    //     </div>
    //   </body>
    // </div>
  );
}

export default CaptureImgRecord;
