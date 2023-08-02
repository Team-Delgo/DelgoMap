export interface Cert {
  categoryCode: string;
  address: string;
  certificationId: number;
  description: string;
  geoCode: string;
  isPhotoChecked: boolean;
  latitude: string;
  isLike: boolean;
  longitude: string;
  likeCount: number;
  commentCount: number;
  mungpleId: number;
  p_geoCode: string;
  photoUrl: string;
  placeName: string;
  registDt: string;
  userId: number;
  userName: string;
}
export const certDefault: Cert = {
  categoryCode: '',
  certificationId: 0,
  description: '',
  likeCount: 0,
  commentCount: 0,
  isLike: false,
  address: '',
  geoCode: '',
  isPhotoChecked: false,
  latitude: '',
  longitude: '',
  mungpleId: 0,
  p_geoCode: '',
  photoUrl: '',
  placeName: '',
  registDt: '',
  userId: 0,
  userName: '',
};

export const idDefault = {
  img: '',
  title: '',
  address: '',
  detailUrl: '',
  id: 0,
  prevId: 0,
  lat: 0,
  lng: 0,
  categoryCode: '0',
  prevCategoryCode: '0',
};

export interface Mungple {
  categoryCode: string;
  address: string;
  latitude: string;
  longitude: string;
  detailUrl: string;
  mungpleId: number;
  placeName: string;
  placeNameEn: string | null;
  photoUrl: string;
}

export interface WardOffice {
  geoCode: string;
  latitude: string;
  longitude: string;
  name: string;
  registDt: string;
  wardOfficeId: number;
}

export interface MungpleMarkerType {
  id: number;
  category: string;
  marker: kakao.maps.Marker;
}

export interface SelectedMungpleType {
  img: string;
  title: string;
  address: string;
  detailUrl: string;
  id: number;
  prevId: number;
  lat: number;
  lng: number;
  categoryCode: string;
  prevCategoryCode: string;
}