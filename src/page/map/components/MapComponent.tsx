import { Mungple, Cert } from './maptype';
import Cafe from '../../../common/icons/cafe-map.svg';
import CafeSmall from '../../../common/icons/cafe-map-small.svg';
import Bath from "../../../common/icons/bath-map.svg";
import BathSmall from "../../../common/icons/bath-map-small.svg";
import Eat from "../../../common/icons/eat-map.svg";
import EatSmall from "../../../common/icons/eat-map-small.svg";
import Beauty from "../../../common/icons/beauty-map.svg";
import BeautySmall from "../../../common/icons/beauty-map-small.svg";
import Hospital from "../../../common/icons/hospital-map.svg";
import HospitalSmall from "../../../common/icons/hospital-map-small.svg";
import Walk from "../../../common/icons/walk-map.svg";
import WalkSmall from "../../../common/icons/walk-map-small.svg";
import Kinder from "../../../common/icons/kinder-map.svg";
import KinderSmall from "../../../common/icons/kinder-map-small.svg";


function setMarkerOptionBig(categoryCode: string, data: Mungple, globarMap: naver.maps.Map | undefined, prevCategoryCode: string) {
  let icon: string;
  if (categoryCode === 'CA0001') icon = Walk;
  else if (categoryCode === 'CA0002') icon = Cafe;
  else if (categoryCode === 'CA0003') icon = Eat;
  else if (categoryCode === 'CA0004') icon = Bath;
  else if (categoryCode === 'CA0005') icon = Beauty;
  else if (categoryCode === 'CA0006') icon = Hospital;
  else icon = Kinder;
  const markerOptions = {
    position: new window.naver.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude)),
    map: globarMap!,
    icon: {
      content: [`<div class="mungple ${prevCategoryCode} big" >`, `<img src=${icon} style="" alt="pin"/>`, `</div>`].join(''),
      size: new naver.maps.Size(50, 59),
      origin: new naver.maps.Point(0, 0),
    },
  };
  return markerOptions;
}

function setMarkerOptionSmall(categoryCode: string, data: Mungple, globarMap: naver.maps.Map | undefined) {
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
    position: new window.naver.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude)),
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
      content: [`<div class="mungple ${selectedId.prevCategoryCode}" >`, `<img src=${icon} style="" alt="pin"/>`, `</div>`].join(''),
      size: new naver.maps.Size(20, 20),
      origin: new naver.maps.Point(0, 0),
      anchor: new naver.maps.Point(10, 10),
    },
  };
  return markerOptions;
}


function setCertOption(data: Cert, globarMap: naver.maps.Map | undefined) {
  return {
    position: new window.naver.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude)),
    map: globarMap!,
    icon: {
      content: [
        `<div class="pin2">`,
        `<img src=${data.photoUrl} style="z-index:${data.certificationId + 1}" alt="pin"/>`,
        `</div>`,
      ].join(''),
      size: new naver.maps.Size(70, 70),
      origin: new naver.maps.Point(0, 0),
    },
  };
}

export { setMarkerOptionBig, setMarkerOptionSmall, setMarkerOptionPrev, setCertOption }