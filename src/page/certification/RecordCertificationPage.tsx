import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { Cert } from '../../common/types/map';
import RecordCertification from './RecordCertification';
import './RecordCertificationPage.scss';
import { RECORD_PATH, ROOT_PATH } from '../../common/constants/path.const';
import Loading from '../../common/utils/BallLoading';
import {
  getRecordCertificationDate,
  getRecordCertificationId,
} from '../../common/api/record';
import PageHeader from '../../components/PageHeader';
import FullScreenImageSlider from '../detail/components/FullScreenImageSlider';

interface LocationState {
  certId: number;
  userId: number;
  date: string;
}

function RecordCertificationPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageFrom = useLocation().state.from as string;
  const certInfo = useLocation().state.info as LocationState;
  const { certId, date, userId } = certInfo;
  const [certifications, setCertifications] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullImgList,setFullImgList] = useState<Array<string>>([])
  const [fullImgName,setFullImgName] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullScreenSliderOpen, setIsFullScreenSliderOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(pageFrom);
    if (pageFrom === RECORD_PATH.PHOTO || pageFrom === ROOT_PATH) {
      getRecordCertificationId(userId, certId, (response: AxiosResponse) => {
        setCertifications(response.data.data);
      });
    } else if (pageFrom === RECORD_PATH.CALENDAR) {
      getRecordCertificationDate(userId, date, (response: AxiosResponse) => {
        setCertifications(response.data.data);
      });
    }
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
    navigate(-1);
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
          <PageHeader title={date?.slice(0, 10)} navigate={navigateBack} isFixed />
          <div className="record-certs-content">{contents}</div>
        </>
      )}
    </div>
  );
}

export default RecordCertificationPage;
