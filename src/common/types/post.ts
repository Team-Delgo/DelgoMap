export interface postType {
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
  isHideAddress:boolean;
  photos:Array<string>
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
