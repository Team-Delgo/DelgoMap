import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { Cert } from '../../common/types/map';
import RecordCertification from './RecordCertification';
import Back from '../../common/icons/prev-arrow-black.svg';
import './RecordCertificationPage.scss';
import { RECORD_PATH, ROOT_PATH } from '../../common/constants/path.const';
import Loading from '../../common/utils/BallLoading';
import {
  getRecordCertificationDate,
  getRecordCertificationId,
} from '../../common/api/record';
import PageHeader from '../../components/PageHeader';

interface LocationState {
  certId: number;
  userId: number;
  date: string;
}

function RecordCertificationPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageFrom = useLocation().state.from as string;
  const certInfo = useLocation().state.info as LocationState;
  console.log(certInfo);
  const { certId, date, userId } = certInfo;
  const [certifications, setCertifications] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const { certifications, pageFrom } = locationState;
  useEffect(() => {
    console.log(pageFrom);
    if (pageFrom === RECORD_PATH.PHOTO || pageFrom === ROOT_PATH) {
      getRecordCertificationId(userId, certId, (response: AxiosResponse) => {
        console.log(response);
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

  const contents = certifications.map((e: Cert) => {
    return <RecordCertification certification={e} />;
  });

  let headerFrom: string;
  if (pageFrom === RECORD_PATH.CALENDAR) headerFrom = 'calendar';
  else if (pageFrom === ROOT_PATH) headerFrom = 'map';
  else headerFrom = 'photo';

  const navigateBack = () => {
    navigate(pageFrom, { state: headerFrom });
  };

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
