import React from 'react';
import NormalCert from '../../../common/icons/normal-cert.svg';
import { Cert, certDefault } from '../../map/index.types';

export function setNormalCertMarker(
  certList: Cert[],
  map: kakao.maps.Map,
  setCert: React.Dispatch<React.SetStateAction<Cert>>,
) {
  console.log(certList);
  const markers = certList.map((m) => {
    const icon = NormalCert;
    const content = document.createElement('div');
    content.className = 'normalCert';
    content.setAttribute('aria-hidden', 'true');

    const iconImg = document.createElement('img');
    iconImg.src = icon;
    iconImg.className = 'outside-image';
    iconImg.alt = 'pin';

    const insideImg = document.createElement('img');
    insideImg.src = m.photoUrl;
    insideImg.className = 'inside-image';
    insideImg.alt = 'cert';

    content.appendChild(iconImg);
    content.appendChild(insideImg);
    const marker = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(parseFloat(m.latitude), parseFloat(m.longitude)),
      content,
      map,
      clickable: true,
    });
    content.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(e);
      setCert(m);
      map?.setLevel(6);
      map?.panTo(new kakao.maps.LatLng(parseFloat(m.latitude), parseFloat(m.longitude)));
    });
    marker.setMap(map);
    return marker;
  });
  return markers;
}
