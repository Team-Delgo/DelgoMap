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

export function MarkerImages() {
  let imageSize = new kakao.maps.Size(50, 59);
  let imageOptions = {
    offset: new kakao.maps.Point(0, 0),
  };
  const images = [];
  images.push(new kakao.maps.MarkerImage(Cafe, imageSize, imageOptions));
  images.push(new kakao.maps.MarkerImage(Bath, imageSize, imageOptions));
  images.push(new kakao.maps.MarkerImage(Eat, imageSize, imageOptions));
  images.push(new kakao.maps.MarkerImage(Beauty, imageSize, imageOptions));
  images.push(new kakao.maps.MarkerImage(Hospital, imageSize, imageOptions));
  images.push(new kakao.maps.MarkerImage(Walk, imageSize, imageOptions));
  images.push(new kakao.maps.MarkerImage(Kinder, imageSize, imageOptions));
  imageSize = new kakao.maps.Size(20, 20);
  imageOptions = {
    offset: new kakao.maps.Point(10, 10),
  };
  const smallImages = [];
  smallImages.push(new kakao.maps.MarkerImage(CafeSmall, imageSize, imageOptions));
  smallImages.push(new kakao.maps.MarkerImage(BathSmall, imageSize, imageOptions));
  smallImages.push(new kakao.maps.MarkerImage(EatSmall, imageSize, imageOptions));
  smallImages.push(new kakao.maps.MarkerImage(BeautySmall, imageSize, imageOptions));
  smallImages.push(new kakao.maps.MarkerImage(HospitalSmall, imageSize, imageOptions));
  smallImages.push(new kakao.maps.MarkerImage(WalkSmall, imageSize, imageOptions));
  smallImages.push(new kakao.maps.MarkerImage(KinderSmall, imageSize, imageOptions));
  
  return { images, smallImages };
}
