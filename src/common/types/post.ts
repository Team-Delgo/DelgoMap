export interface postType {
  mungpleId: number;
  categoryCode: string;
  address: string;
  certificationId: number;
  commentCount: number;
  registDt: string;
  description: string;
  isLike: boolean;
  likeCount: number;
  photoUrl: string;
  placeName: string;
  userId: number;
  userName: string;
  userProfile: string;
  isHideAddress: boolean;
  photos: Array<string>;
  reactionCountMap: {
    CUTE: number;
    HELPER: number;
  };
  reactionMap: {
    CUTE: boolean;
    HELPER: boolean;
  };
  latitude: string;
  longitude: string;
}

export interface userType {
  address: string;
  appleUniqueNo: null;
  email: string;
  geoCode: string;
  name: string;
  password: string;
  pgeoCode: string;
  phoneNo: string;
  profile: string;
  registDt: string;
  userId: number;
  userSocial: string;
}
