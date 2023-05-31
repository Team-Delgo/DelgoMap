import axios, { AxiosResponse } from 'axios';
import axiosInstance from './interceptors';
import { useErrorHandlers } from './useErrorHandlers';
import { APIResponse } from '../types/api';

interface BusinessHours {
  MON: string;
  TUE: string;
  WED: string;
  THU: string;
  FRI: string;
  SAT: string;
  SUN: string;
  LAST_ORDER: string;
}

interface DetailPageResponse {
  mungpleId: number;
  categoryCode: string;
  placeName: string;
  placeNameEn: string;
  roadAddress: string;
  jibunAddress: string;
  geoCode: string;
  latitude: string;
  longitude: string;
  photoUrl: string;
  detailUrl: string;
  businessHour: BusinessHours;
  residentDogName: string;
  representSite: string;
  representMenuTitle: string;
  acceptSize: { S: string; M: string; L: string };
  representMenuPhotoUrl: string[];
  parkingLimit: number;
  editorNoteUrl: string;
  copyLink: string;
  pgeoCode: string;
}

export async function getDetailPageData(mungpleId: number) {
  const { data } = await axiosInstance.get<APIResponse<DetailPageResponse>>(
    `/mungple/detail?mungpleId=${mungpleId}`,
  );
  return data;
}
