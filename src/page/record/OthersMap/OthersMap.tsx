import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useQuery } from 'react-query';
import CertCard from '../../map/components/CertCard';
import BackArrowComponent from '../../../components/BackArrowComponent';
import { othersMapAction } from 'redux/slice/othersMapSlice';
import { getUserInfo } from 'common/api/othersmap';
import { useNavigate } from 'react-router-dom';
import { Cert, certDefault } from '../../map/index.types';
import { setNormalCertMarker } from './OthersMakerSet';
import dogfoot from '../../../common/icons/dogfoot-small.svg';
import dot from '../../../common/icons/dot.svg';
import eye from '../../../common/icons/eye.svg';
import { clear } from 'console';

function OthersMap() {
  const mapElement = useRef(null);
  const navigate = useNavigate();
  const [map, setMap] = useState<kakao.maps.Map>();
  const initialMapCenter = useSelector((state: RootState) => state.othersMap);
  const splitUrl = window.location.href.split('/');
  const userId = parseInt(splitUrl[splitUrl.length - 1], 10);
  const [isFirstRendering, setIsFirstRendering] = useState({ cert: true });
  const [certMarkers, setCertMarkers] = useState<kakao.maps.CustomOverlay[]>([]);
  const [selectedCert, setSelectedCert] = useState<Cert>(certDefault);
  const dispatch = useDispatch();
  const { data: userInfo } = useQuery(['getUserInfo', userId], () => getUserInfo(userId));
  const clearSelectedCert = () => setSelectedCert(certDefault);

  const setCurrentMapLocation = () => {
    const center = map?.getCenter();
    const zoom = map?.getLevel();
    dispatch(
      othersMapAction.setCurrentPosition({
        lat: center?.getLat(),
        lng: center?.getLng(),
        zoom,
      }),
    );
  };

  useEffect(() => {
    const options = {
      center: new kakao.maps.LatLng(initialMapCenter.lat, initialMapCenter.lng),
      level: 13,
    };
    if (!mapElement.current) return;
    const map = new kakao.maps.Map(mapElement.current, options);
    setMap(map);
  }, []);
  const handleBackClick = () => {
    if (selectedCert && map?.getLevel() != 13) map?.setLevel(13);
    else navigate(-1);
  };

  useEffect(() => {
    if (userInfo && map && isFirstRendering.cert) {
      if (userId > 0) {
        const certMarkers = setNormalCertMarker(userInfo.certs, map, setSelectedCert);
        setCertMarkers(certMarkers);
        setIsFirstRendering((prev) => ({ ...prev, cert: false }));
      }
    }
  }, [map, userInfo]);

  useEffect(() => {
    if (!map) return;
    kakao.maps.event.addListener(map, 'click', clearSelectedCert);
  }, [map]);

  return (
    <div>
      <div className="relative z-50 h-[60px] w-screen bg-white pt-[9px]">
        <BackArrowComponent onClickHandler={handleBackClick} />
        {userInfo && (
          <div className="text-center text-lg font-bold leading-[150%]">
            {userInfo.nickname}
          </div>
        )}
        <div className="flex justify-center">
          <img src={dogfoot} />
          {userInfo && (
            <div className="ml-[4px] mr-[6px] text-[12px] font-bold leading-[150%] text-[#646566]">
              {userInfo.totalCount}
            </div>
          )}
          <img src={dot} />
          <img className="ml-[6px]" src={eye} />
          {userInfo && (
            <div className="ml-[4px] mr-[6px] text-[12px] font-bold leading-[150%] text-[#646566]">
              {userInfo.viewCount}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 h-screen w-screen" ref={mapElement} />
      {selectedCert.userId > 0 && (
        <CertCard
          cert={selectedCert}
          img={selectedCert.photos[0]}
          title={selectedCert.placeName}
          categoryCode={selectedCert.categoryCode}
          registDt={selectedCert.registDt}
          description={selectedCert.description}
          setCenter={setCurrentMapLocation}
        />
      )}
    </div>
  );
}
export default OthersMap;
