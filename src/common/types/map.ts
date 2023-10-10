export type CategoryCode =
  | 'CA0001'
  | 'CA0002'
  | 'CA0003'
  | 'CA0004'
  | 'CA0005'
  | 'CA0006'
  | 'CA0007'
  | 'CA9999';

export interface Cert {
  categoryCode: CategoryCode;
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
  categoryCode: 'CA9999',
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

export interface SelectedMungple {
  img: string;
  title: string;
  address: string;
  detailUrl: string;
  id: number;
  prevId: number;
  lat: number;
  lng: number;
  categoryCode: CategoryCode;
  prevCategoryCode: CategoryCode;
}

export const defaultSelectedMungple: SelectedMungple = {
  img: '',
  title: '',
  address: '',
  detailUrl: '',
  id: 0,
  prevId: 0,
  lat: 0,
  lng: 0,
  categoryCode: 'CA0001',
  prevCategoryCode: 'CA0001',
};

export interface Mungple {
  mungpleId: number;
  categoryCode: CategoryCode;
  phoneNo: string;
  placeName: string;
  address:string;
  placeNameEn: string;
  geoCode: string;
  pGeoCode: string;
  latitude: string;
  longitude: string;
  detailUrl: string;
  isActive: boolean;
  createdAt: Date;
  photoUrls: string[];
  enterDesc: string;
  // acceptSize
  // businessHour
  instaId: string;
  isParking: boolean;
  parkingInfo: string;
  residentDogName: string;
  residentDogPhoto: string;
  representMenuTitle: string;
  representMenuPhotoUrls: string[];
  representMenuBoardPhotoUrls: string[];
  isPriceTag: boolean;
  priceTagPhotoUrls: string[];
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
