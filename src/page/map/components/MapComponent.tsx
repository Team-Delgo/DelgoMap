import { NavigateFunction } from 'react-router-dom';
import { Mungple, Cert } from './maptype';
import Cafe from '../../../common/icons/cafe-map.svg';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import Bath from '../../../common/icons/bath-map.svg';
import BathSmall from '../../../common/icons/bath-map-small.svg';
import Eat from '../../../common/icons/eat-map.svg';
import EatSmall from '../../../common/icons/eat-map-small.svg';
import Beauty from '../../../common/icons/beauty-map.svg';
import BeautySmall from '../../../common/icons/beauty-map-small.svg';
import Hospital from '../../../common/icons/hospital-map.svg';
import HospitalSmall from '../../../common/icons/hospital-map-small.svg';
import Walk from '../../../common/icons/walk-map.svg';
import WalkSmall from '../../../common/icons/walk-map-small.svg';
import Kinder from '../../../common/icons/kinder-map.svg';
import KinderSmall from '../../../common/icons/kinder-map-small.svg';

import WalkCert from '../../../common/icons/walk-cert.svg';
import CafeCert from '../../../common/icons/cafe-cert.svg';
import EatCert from '../../../common/icons/eat-cert.svg';
import BathCert from '../../../common/icons/bath-cert.svg';
import BeauthCert from '../../../common/icons/beauty-cert.svg';
import HospitalCert from '../../../common/icons/hospital-cert.svg';
import NormalCert from '../../../common/icons/normal-cert.svg';
import { POSTS_PATH } from '../../../common/constants/path.const';

function setMarkerOptionBig(
  categoryCode: string,
  data: Mungple,
  globarMap: naver.maps.Map | undefined,
  prevCategoryCode: string,
) {
  let icon: string;
  if (categoryCode === 'CA0001') icon = Walk;
  else if (categoryCode === 'CA0002') icon = Cafe;
  else if (categoryCode === 'CA0003') icon = Eat;
  else if (categoryCode === 'CA0004') icon = Bath;
  else if (categoryCode === 'CA0005') icon = Beauty;
  else if (categoryCode === 'CA0006') icon = Hospital;
  else icon = Kinder;
  const markerOptions = {
    position: new window.naver.maps.LatLng(
      parseFloat(data.latitude),
      parseFloat(data.longitude),
    ),
    map: globarMap!,
    icon: {
      content: [
        `<div class="mungple ${prevCategoryCode} big" >`,
        `<img src=${icon} style="" alt="pin"/>`,
        `</div>`,
      ].join(''),
      size: new naver.maps.Size(50, 59),
      origin: new naver.maps.Point(0, 0),
    },
  };
  return markerOptions;
}

function setMarkerOptionSmall(
  categoryCode: string,
  data: Mungple,
  globarMap: naver.maps.Map | undefined,
) {
  let icon: string;
  console.log(categoryCode);
  if (categoryCode === 'CA0001') icon = WalkSmall;
  else if (categoryCode === 'CA0002') icon = CafeSmall;
  else if (categoryCode === 'CA0003') icon = EatSmall;
  else if (categoryCode === 'CA0004') icon = BathSmall;
  else if (categoryCode === 'CA0005') icon = BeautySmall;
  else if (categoryCode === 'CA0006') icon = HospitalSmall;
  else icon = KinderSmall;
  const markerOptions = {
    position: new window.naver.maps.LatLng(
      parseFloat(data.latitude),
      parseFloat(data.longitude),
    ),
    map: globarMap!,
    icon: {
      content: [
        `<div id=${data.mungpleId} class="mungple ${data.categoryCode} small" >`,
        `<img src=${icon}  style="" alt="pin"/>`,
        `</div>`,
      ].join(''),
      size: new naver.maps.Size(20, 20),
      origin: new naver.maps.Point(0, 0),
      anchor: new naver.maps.Point(10, 10),
    },
  };
  return markerOptions;
}

function setMarkerOptionPrev(
  categoryCode: string,
  selectedId: {
    img: string;
    title: string;
    address: string;
    id: number;
    prevId: number;
    lat: number;
    lng: number;
    categoryCode: string;
    prevLat: number;
    prevLng: number;
    prevCategoryCode: string;
  },
  globarMap: naver.maps.Map | undefined,
) {
  let icon: string;
  if (categoryCode === 'CA0001') icon = WalkSmall;
  else if (categoryCode === 'CA0002') icon = CafeSmall;
  else if (categoryCode === 'CA0003') icon = EatSmall;
  else if (categoryCode === 'CA0004') icon = BathSmall;
  else if (categoryCode === 'CA0005') icon = BeautySmall;
  else if (categoryCode === 'CA0006') icon = HospitalSmall;
  else icon = KinderSmall;
  const markerOptions = {
    position: new window.naver.maps.LatLng(selectedId.prevLat, selectedId.prevLng),
    map: globarMap!,
    icon: {
      content: [
        `<div class="mungple ${selectedId.prevCategoryCode}" >`,
        `<img src=${icon} style="" alt="pin"/>`,
        `</div>`,
      ].join(''),
      size: new naver.maps.Size(20, 20),
      origin: new naver.maps.Point(0, 0),
      anchor: new naver.maps.Point(10, 10),
    },
  };
  return markerOptions;
}

function setCertOption(data: Cert, globarMap: naver.maps.Map | undefined) {
  return {
    position: new window.naver.maps.LatLng(
      parseFloat(data.latitude),
      parseFloat(data.longitude),
    ),
    map: globarMap!,
    icon: {
      content: [
        `<div class="pin2">`,
        `<img src=${data.photoUrl} style="z-index:${
          data.certificationId + 1
        }" alt="pin"/>`,
        `</div>`,
      ].join(''),
      size: new naver.maps.Size(70, 70),
      origin: new naver.maps.Point(0, 0),
    },
  };
}

function setCertNormalMarker(
  normalCertList: Cert[],
  globarMap: naver.maps.Map | undefined,
  setSelectedCert: React.Dispatch<React.SetStateAction<Cert>>,
) {
  return normalCertList.map((data) => {
    const markerOptions = setCertOption(data, globarMap);
    const marker = new naver.maps.Marker(markerOptions);
    marker.addListener('click', () => {
      setSelectedCert((prev) => {
        return {
          ...prev,
          userId: data.userId,
          isLike: data.isLike,
          likeCount: data.likeCount,
          commentCount: data.commentCount,
          categoryCode: data.categoryCode,
          certificationId: data.certificationId,
          description: data.description,
          photoUrl: data.photoUrl,
          placeName: data.placeName,
          registDt: data.registDt,
        };
      });
    });
    return marker;
  });
}

function setCertMungpleMarker(
  mungpleCertList: Cert[],
  globarMap: naver.maps.Map | undefined,
  currentLocation: {
    lat: number;
    lng: number;
    zoom: number;
    option: { zoom: number; size: number };
  },
  setSelectedCert: React.Dispatch<React.SetStateAction<Cert>>,
) {
  return mungpleCertList.map((data) => {
    const markerOptions = {
      position: new window.naver.maps.LatLng(
        parseFloat(data.latitude),
        parseFloat(data.longitude),
      ),
      map: globarMap!,
      icon: {
        content: [
          `<div class="pin${currentLocation.option.zoom} mungplepin ${data.categoryCode}" style="z-index:${data.certificationId}">`,
          `<img src=${data.photoUrl} style="z-index:${
            data.certificationId + 1
          }" alt="pin"/>`,
          `</div>`,
        ].join(''),
        size: new naver.maps.Size(
          currentLocation.option.size,
          currentLocation.option.size,
        ),
        origin: new naver.maps.Point(0, 0),
      },
    };
    const marker = new naver.maps.Marker(markerOptions);
    marker.addListener('click', () => {
      setSelectedCert((prev) => {
        return {
          ...prev,
          categoryCode: data.categoryCode,
          certificationId: data.certificationId,
          description: data.description,
          photoUrl: data.photoUrl,
          placeName: data.placeName,
          registDt: data.registDt,
        };
      });
    });
    return marker;
  });
}

function setOtherDogsMungple(
  otherMungpleCertList: Cert[],
  globarMap: naver.maps.Map | undefined,
  navigate: NavigateFunction
) {
  return otherMungpleCertList.map((data) => {
    let icon: string;
    const { categoryCode } = data;
    if (categoryCode === 'CA0001') icon = WalkCert;
    else if (categoryCode === 'CA0002') icon = CafeCert;
    else if (categoryCode === 'CA0003') icon = EatCert;
    else if (categoryCode === 'CA0004') icon = BathCert;
    else if (categoryCode === 'CA0005') icon = BeauthCert;
    else if (categoryCode === 'CA0006') icon = HospitalCert;
    else icon = NormalCert;
    const markerOptions = {
      position: new window.naver.maps.LatLng(
        parseFloat(data.latitude),
        parseFloat(data.longitude),
      ),
      map: globarMap!,
      icon: {
        content: [
          `<div id=${data.mungpleId} class="mungple ${data.categoryCode} big" >`,
          `<img src=${icon}  style="" alt="pin"/>`,
          `<img src=${data.photoUrl} class="cert" alt="cert-image" />`,
          `</div>`,
        ].join(''),
        size: new naver.maps.Size(53, 63),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(28, 63),
      },
    };
    const marker = new naver.maps.Marker(markerOptions);
    marker.addListener('click', () => {
      navigate(POSTS_PATH, {state: {
        cert:data
      }});
    });
    return marker;
  });
}

export {
  setMarkerOptionBig,
  setMarkerOptionSmall,
  setMarkerOptionPrev,
  setCertOption,
  setCertNormalMarker,
  setCertMungpleMarker,
  setOtherDogsMungple,
};
