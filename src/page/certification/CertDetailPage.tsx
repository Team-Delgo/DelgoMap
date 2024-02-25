import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { Cert } from '../../common/types/map';
import RecordCertification from './RecordCertification';
import './RecordCertificationPage.scss';
import Loading from '../../common/utils/BallLoading';
import {
  getRecordCertificationId,
} from '../../common/api/record';
import PageHeader from '../../components/PageHeader';
import FullScreenImageSlider from '../detail/components/FullScreenImageSlider';
import { ALARM_PATH, ROOT_PATH } from '../../common/constants/path.const';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import footPrint from '../../common/icons/foot_print_purple.svg';
import compass from '../../common/icons/compass_small.svg';

function CertDetailPage() {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.persist.user);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [certifications, setCertifications] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullImgList,setFullImgList] = useState<Array<string>>([])
  const [fullImgName,setFullImgName] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const [isDeletedPost,setIsDeletedPost] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    getRecordCertificationId(user.id, Number(id), (response: AxiosResponse) => {
      if (response.data.data === null) {
        console.log("response.data.data",response.data.data)
        setIsDeletedPost(true);
        return;
      }
      console.log('response.data.data', response.data.data);
      setCertifications(response.data.data);
    });
    scrollRef.current?.scrollIntoView({ block: 'start' });
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  const openFullScreenSlider = (images:Array<string>, index:number,placeName: string) => {
    setFullImgList(images);
    setSelectedImageIndex(index);
    setFullImgName(placeName)
    setIsFullScreenSliderOpen(true);
  };

  const contents = certifications.map((e: Cert) => {
    return <RecordCertification key={e.certificationId} certification={e} openFullScreenSlider={openFullScreenSlider}/>;
  });

  const navigateBack = () => {
    navigate(ALARM_PATH);
  };

  if (isDeletedPost) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center text-black">
          <img src={footPrint} className="h-9 w-9" />
          <p className="my-6 text-base font-bold">게시물이 삭제되었어요</p>
          <div className="flex h-10 w-36 items-center justify-center rounded-full border border-gray-300" onClick={navigateBack}>
            <img src={compass} className="h-3.25 w-2.5" />
            <span className="mx-1" />
            <span className="text-sm">지도로 돌아가기</span>
          </div>
        </div>
      </div>
    );
  }

  if (isFullScreenSliderOpen) {
    return (
      <FullScreenImageSlider
        close={() => setIsFullScreenSliderOpen(false)}
        images={fullImgList}
        index={selectedImageIndex}
        placeName={fullImgName}
      />
    );
  }

  return (
    <div className="record-certs" ref={scrollRef}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageHeader title={certifications[0]?.placeName} navigate={navigateBack} isFixed />
          <div className="record-certs-content">{contents}</div>
        </>
      )}
    </div>
  );
}

export default CertDetailPage;
