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
  address: string;
  photoUrls: string[];
  phoneNo:string;
  businessHour: BusinessHours;
  residentDogName: string;
  residentDogPhoto:string;
  instaId: string;
  representMenuTitle: string;
  acceptSize: { S: string; M: string; L: string };
  representMenuPhotoUrls: string[];
  isParking:boolean;
  parkingInfo:string;
  editorNoteUrl: string;
  copyLink: string;
  certCount:number;
  enterDesc:string;
}

export async function getDetailPageData(mungpleId: number) {
  const { data } = await axiosInstance.get<APIResponse<DetailPageResponse>>(
    `/mungple/detail?mungpleId=${mungpleId}`,
  );
  return data.data;
}
