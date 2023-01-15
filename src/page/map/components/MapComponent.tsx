import { Mungple } from './maptype';

function setMarkerOptionBig(icon: string, data: Mungple, globarMap: naver.maps.Map | undefined, prevCategoryCode: string) {
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

function setMarkerOptionSmall(icon: string, data: Mungple, globarMap: naver.maps.Map | undefined) {
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
  icon: string,
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


// function setCertOption(data: Cert, globarMap: naver.maps.Map | undefined, currentLocation: { lat: number; lng: number; zoom: number; option: { zoom: number; size: number; }; }) {
//   return {
//     position: new window.naver.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude)),
//     map: globarMap!,
//     icon: {
//       content: [
//         `<div class="pin${currentLocation.option.zoom}" style="z-index:${data.certificationId}">`,
//         `<img src=${data.photoUrl} style="z-index:${data.certificationId + 1}" alt="pin"/>`,
//         `</div>`,
//       ].join(''),
//       size: new naver.maps.Size(currentLocation.option.size, currentLocation.option.size),
//       origin: new naver.maps.Point(0, 0),
//     },
//   };
// }

export { setMarkerOptionBig, setMarkerOptionSmall, setMarkerOptionPrev }