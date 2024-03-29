export const ROOT_PATH = '/';
export const MY_ACCOUNT_PATH = {
  MAIN: '/user/myaccount',
  COUPON: '/user/myaccount/coupon',
  SETTINGS: '/user/myaccount/settings',
  PETINFO: '/user/myaccount/petinfo',
  REVIEWS: '/user/myaccount/reviews',
  USERINFO: '/user/myaccount/userinfo',
  PASSWORDCHECK: '/user/myaccount/userinfo/check',
  PASSWORDCHANGE: '/user/myaccount/userinfo/change',
  TERM1: '/user/myaccount/term1',
  TERM2: '/user/myaccount/term2',
};
export const SIGN_IN_PATH = {
  MAIN: '/user/signin',
  SIGNIN: '/user/signin/login',
  FINDPASSWORD: '/user/signin/findpassword',
  PHONEAUTH: '/user/signin/phoneauth',
  RESETPASSWORD: '/user/signin/resetpassword',
};
export const SIGN_UP_PATH = {
  VERIFY: '/user/signup/verify-phone',
  TERMS: '/user/signup/terms',
  USER_INFO: '/user/signup/user-info',
  USER_PET_INFO: '/user/signup/pet-info',
  COMPLETE: '/user/signup/complete',
  UER_PET_TYPE: '/user/signup/pet-type',
  SOCIAL: {
    NICKNAME: '/user/signup/social/nickname',
    USER_PET_INFO: '/user/signup/social/pet-info',
    NO_PHONE: '/user/signup/social/no-phone',
    OTHER: '/user/signup/social/other',
  },
};
export const MY_STORAGE_PATH = '/my-storage';

export const POSTS_PATH = '/posts';

export const UPLOAD_PATH = {
  CAPTURE: '/upload/captureImg',
  LOCATION: '/upload/location',
  CERTIFICATION: '/upload/certification',
  RESULT: '/upload/certification/result',
  UPDATE: '/upload/certification/update',
  MAP: '/upload/certification/map',
};

export const RECORD_PATH = {
  PHOTO: '/photo',
  CALENDAR: '/calendar',
  ACHIEVE: '/achieve',
  CERT: '/certs',
  COMMENT: '/comments/:id',
  MAP: '/map',
  CERT_DETAIL: '/cert/:id',
};

export const CROP_PATH = '/crop';
export const CROP_LIST_PATH = '/crop-list';

export const ACHIEVEMENT_PATH = '/achievement';

export const NEIGHBOR_RANKING_PATH = '/neighbor-ranking';

export const KAKAO_REDIRECT_HANDLE_PATH = '/oauth/callback/kakao';
export const NAVER_REDIRECT_HANDLE_PATH = '/oauth/callback/naver';
export const APPLE_REDIRECT_HANDLE_PATH = '/oauth/callback/apple';


export const ALARM_PATH = '/alarm'
export const DETAIL_MUNGPLE = "/detail/:id"