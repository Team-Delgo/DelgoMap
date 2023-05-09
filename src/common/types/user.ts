import { Point } from "./point";

export interface UserProfile {
    address: string;
    age: number | null;
    appleUniqueNo: string | null;
    email: string;
    gender: string | null;
    geoCode: string;
    kakaoId: string | null;
    name: string;
    notify: boolean;
    password: string;
    pgeoCode: string;
    phoneNo: string;
    profile: string;
    registDt: string;
    userId: number;
    userSocial: string;
    point:Point
  }