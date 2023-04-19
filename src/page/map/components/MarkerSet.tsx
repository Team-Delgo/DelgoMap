import React, { useCallback, useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
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
import { Cert } from './maptype';
import './MarkerSet.scss';
import { POSTS_PATH } from '../../../common/constants/path.const';

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

export interface MarkerImageSets {
  images: kakao.maps.MarkerImage[];
  smallImages: kakao.maps.MarkerImage[];
}

export function clearSelectedId(
  setSelectedId: React.Dispatch<
    React.SetStateAction<{
      img: string;
      title: string;
      address: string;
      detailUrl: string;
      instaUrl: string;
      id: number;
      prevId: number;
      lat: number;
      lng: number;
      categoryCode: string;
      prevLat: number;
      prevLng: number;
      prevCategoryCode: string;
    }>
  >,
  selectedId: {
    img: string;
    title: string;
    address: string;
    detailUrl: string;
    instaUrl: string;
    id: number;
    prevId: number;
    lat: number;
    lng: number;
    categoryCode: string;
    prevLat: number;
    prevLng: number;
    prevCategoryCode: string;
  },
) {
  return useCallback(() => {
    setSelectedId((prev: any) => {
      return {
        img: '',
        title: '',
        address: '',
        id: 0,
        prevId: prev.id,
        lat: 0,
        detailUrl: '',
        instaUrl: '',
        lng: 0,
        categoryCode: '0',
        prevLat: prev.lat,
        prevLng: prev.lng,
        prevCategoryCode: prev.categoryCode,
      };
    });
  }, [selectedId]);
}
// MarkerImages 함수

export function setMarkerImageBig(categoryCode: string) {
  const images = MarkerImages();
  if (categoryCode === 'CA0001') return images.images[1];
  if (categoryCode === 'CA0002') return images.images[0];
  if (categoryCode === 'CA0003') return images.images[2];
  if (categoryCode === 'CA0004') return images.images[3];
  if (categoryCode === 'CA0005') return images.images[4];
  if (categoryCode === 'CA0006') return images.images[5];
  return images.images[6];
}

export function setMarkerImageSmall(categoryCode: string) {
  const images = MarkerImages();
  if (categoryCode === 'CA0001') return images.smallImages[1];
  if (categoryCode === 'CA0002') return images.smallImages[0];
  if (categoryCode === 'CA0003') return images.smallImages[2];
  if (categoryCode === 'CA0004') return images.smallImages[3];
  if (categoryCode === 'CA0005') return images.smallImages[4];
  if (categoryCode === 'CA0006') return images.smallImages[5];
  return images.smallImages[6];
}

export function setNormalCertMarker(
  certList: Cert[],
  map: kakao.maps.Map,
  setCert: React.Dispatch<React.SetStateAction<Cert>>,
) {
  const markers = certList.map((m) => {
    const icon = NormalCert;
    const content = document.createElement("div");
    content.className = "normalCert";
    content.setAttribute("aria-hidden", "true");

    const iconImg = document.createElement("img");
    iconImg.src = icon;
    iconImg.className = "outside-image";
    iconImg.alt = "pin";

    const insideImg = document.createElement("img");
    insideImg.src = m.photoUrl;
    insideImg.className = "inside-image";
    insideImg.alt = "cert";

    content.appendChild(iconImg);
    content.appendChild(insideImg);
    const marker = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(parseFloat(m.latitude), parseFloat(m.longitude)),
      content,
      map,
      clickable:true
    });
    content.addEventListener("click", (e)=>{
      e.stopPropagation();
      setCert(m)
    });
    marker.setMap(map);
    return marker;
  });
  return markers;
}

export function setMungpleCertMarker(certList: Cert[], map: kakao.maps.Map) {
  const markers = certList.map((m) => {
    const icon = NormalCert;
    const content = `
      <div class"normalCert">
      <img src="${icon}" class="outside-image" alt="pin" />
      <img src="${m.photoUrl}" class="inside-image" alt="cert"/>
      </div>
    `;
    const marker = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(parseFloat(m.latitude), parseFloat(m.longitude)),
      content,
      map,
    });
    marker.setMap(map);
    return marker;
  });
  return markers;
}

export function setOtherNormalCertMarker(
  certList: Cert[],
  map: kakao.maps.Map,
  navigate: NavigateFunction
) {
  const markers = certList.map((m) => {
    const icon = NormalCert;
    const content = document.createElement("div");
    content.className = "normalCert";
    content.setAttribute("aria-hidden", "true");

    const iconImg = document.createElement("img");
    iconImg.src = icon;
    iconImg.className = "outside-image";
    iconImg.alt = "pin";

    const insideImg = document.createElement("img");
    insideImg.src = m.photoUrl;
    insideImg.className = "inside-image";
    insideImg.alt = "cert";

    content.appendChild(iconImg);
    content.appendChild(insideImg);
    content.addEventListener('click', ()=>{
      navigate(POSTS_PATH, {
        state:{
          cert: m,
          from: 'homeCert',
        }
      })
    })
    const marker = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(parseFloat(m.latitude), parseFloat(m.longitude)),
      content,
      map,
      zIndex:11,
      clickable:true
    });
    marker.setMap(map);
    return marker;
  });
  return markers;
}


export function MarkerImages() {
  let imageSize = new kakao.maps.Size(50, 59);
  let imageOptions = {
    offset: new kakao.maps.Point(25, 49),
  };
  const images: kakao.maps.MarkerImage[] = [];
  [Cafe, Bath, Eat, Beauty, Hospital, Walk, Kinder].forEach((url: string) => {
    const image = loadImage(url);
    images.push(new kakao.maps.MarkerImage(url, imageSize, imageOptions));
  });

  imageSize = new kakao.maps.Size(20, 20);
  imageOptions = {
    offset: new kakao.maps.Point(10, 10),
  };
  const smallImages: kakao.maps.MarkerImage[] = [];
  [
    CafeSmall,
    BathSmall,
    EatSmall,
    BeautySmall,
    HospitalSmall,
    WalkSmall,
    KinderSmall,
  ].forEach((url: string) => {
    const image = loadImage(url);
    smallImages.push(new kakao.maps.MarkerImage(url, imageSize, imageOptions));
  });

  return { images, smallImages };
}

function TempMarkerImageLoader() {
  const [load, setIsLoad] = useState(true);

  return (
    <div>
      {load && (
        <div>
          <img src={Cafe} alt="l-Cafe" />
          <img src={Walk} alt="l-Walk" />
          <img src={Hospital} alt="l-Hospital" />
          <img src={Beauty} alt="l-Beauty" />
          <img src={Kinder} alt="l-Kinder" />
          <img src={Eat} alt="l-Eat" />
          <img src={Bath} alt="l-Bath" />
        </div>
      )}
    </div>
  );
}

export default TempMarkerImageLoader;