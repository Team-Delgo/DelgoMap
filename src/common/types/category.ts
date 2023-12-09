import Bath from '../icons/bath.svg';
import Beauty from '../icons/beauty.svg';
import Cafe from '../icons/cafe.svg';
import Hospital from '../icons/hospital.svg';
import Restorant from '../icons/restorant.svg';
import Walk from '../icons/walk.svg';
import ETC from '../icons/etc.svg';

export interface categoryType {
  산책: string;
  카페: string;
  식당: string;
  목욕: string;
  미용: string;
  병원: string;
  유치원: string;
  기타: string;
  [prop: string]: string;
}

export interface categoryType2 {
  CA0001: string;
  CA0002: string;
  CA0003: string;
  CA0004: string;
  CA0005: string;
  CA0006: string;
  CA0007: string;
  CA9999: string;
  [prop: string]: string;
}

export interface categoryType3 {
  CA0001: number;
  CA0002: number;
  CA0003: number;
  CA0004: number;
  CA0005: number;
  CA0006: number;
  CA0007: number;
  CA9999: number;
  [prop: number]: string;
}

export interface categoryColor {
  CA0001: string;
  CA0002: string;
  CA0003: string;
  CA0005: string;
  CA0006: string;
  CA0007: string;
  CA9999: string;
  [key: string]: string;
}

export interface ImgSmallKey {
  WalkSmall: string;
  CafeSmall: string;
  EatSmall: string;
  BeautySmall: string;
  HospitalSmall: string;
  KinderSmall: string;
  EtcSmall: string;
  [key: string]: string;
}

export const categoryCode: categoryType = {
  산책: 'CA0001',
  카페: 'CA0002',
  식당: 'CA0003',
  목욕: 'CA0004',
  미용: 'CA0005',
  병원: 'CA0006',
  유치원: 'CA0007',
  기타: 'CA9999',
};

export const categoryCode2: categoryType2 = {
  CA0000: '전체',
  CA0001: '산책',
  CA0002: '카페',
  CA0003: '식당',
  CA0004: '목욕',
  CA0005: '미용',
  CA0006: '병원',
  CA0007: '유치원',
  CA9999: '기타',
};

export const categoryIcon = {
  산책: Walk,
  카페: Cafe,
  식당: Restorant,
  목욕: Bath,
  미용: Beauty,
  병원: Hospital,
  기타: ETC,
};

export const categoryIcon2 = {
  CA0001: Walk,
  CA0002: Cafe,
  CA0003: Restorant,
  CA0004: Bath,
  CA0005: Beauty,
  CA0006: Hospital,
  CA9999: ETC,
};

export const categoryColor: categoryColor = {
  CA0001: '#6ABC77',
  CA0002: '#8E6947',
  CA0003: '#FF6363',
  CA0005: '#FF7C9C',
  CA0006: '#4FBDBD',
  CA0007: '#FF9649',
  CA9999: '#3D3D3D',
};

export const imgSmallKey: ImgSmallKey = {
  WalkSmall: 'CA0001',
  CafeSmall: 'CA0002',
  EatSmall: 'CA0003',
  BeautySmall: 'CA0005',
  HospitalSmall: 'CA0006',
  KinderSmall: 'CA0007',
  EtcSmall: 'CA9999',
};