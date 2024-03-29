import axiosInstance from './interceptors';
import { APIResponse } from '../types/api';
import { postType } from '../types/post';

interface BusinessHours {
  MON: string;
  TUE: string;
  WED: string;
  THU: string;
  FRI: string;
  SAT: string;
  SUN: string;
  LAST_ORDER: string;
  BREAK_TIME: string;
  HOLIDAY: string;
}

interface DetailPageResponse {
  mungpleId: number;
  categoryCode: string;
  placeName: string;
  placeNameEn: string;
  address: string;
  photoUrls: string[];
  latitude:number;
  longitude:number;
  phoneNo: string;
  businessHour: BusinessHours;
  residentDogName: string | null;
  residentDogPhoto: string | null;
  instaId: string;
  representMenuTitle: string | null;
  isPriceTag: boolean;
  priceTagPhotoUrls: string[];
  acceptSize: { S: string; M: string; L: string };
  representMenuPhotoUrls: string[];
  isParking: boolean;
  isBookmarked: boolean;
  parkingInfo: string;
  bookmarkCount: number;
  editorNoteUrl: string;
  copyLink: string;
  certCount: number;
  enterDesc: string;
}

interface ReivewsResponse {
  content: postType[];
  size: number;
  number: number;
  last: boolean;
}

export async function getDetailPageData(mungpleId: number, userId: number) {
  const { data } = await axiosInstance.get<APIResponse<DetailPageResponse>>(
    `/mungple/detail?mungpleId=${mungpleId}&userId=${userId}`,
  );
  return data.data;
}

export async function getDetailPageReviews(
  pageParam: number,
  userId: number,
  mungpleId: number,
  pageSize: number,
) {
  const { data } = await axiosInstance.get<APIResponse<ReivewsResponse>>(
    `/certification/mungple?userId=${userId}&mungpleId=${mungpleId}&page=${pageParam}&size=${pageSize}`,
  );
  return data.data;
}

interface SetBookmarkResponseDTO {
  bookmarkId: number;
  userId: number;
  mungpleId: number;
  isBookmarked: boolean;
}

export async function setBookmark(userId: number, mungpleId: number) {
  const { data } = await axiosInstance.post<APIResponse<SetBookmarkResponseDTO>>(
    `/bookmark/${userId}/${mungpleId}`,
  );
  return data.data;
}
