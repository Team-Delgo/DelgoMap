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
import { ROOT_PATH } from 'common/constants/path.const';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';


function CertDetailPage() {
  const { id } = useParams();
  const { user, isSignIn } = useSelector((state: RootState) => state.persist.user);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [certifications, setCertifications] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullImgList,setFullImgList] = useState<Array<string>>([])
  const [fullImgName,setFullImgName] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getRecordCertificationId(user.id, Number(id), (response: AxiosResponse) => {
        console.log("response.data.data",response.data.data)
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
    navigate(ROOT_PATH);
  };

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
