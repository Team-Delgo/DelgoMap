export interface MungPlaceType {
  categoryCode: string;
  geoCode: string;
  jibunAddress: string;
  latitude: string;
  longitude: string;
  mungpleId: number;
  p_geoCode: string;
  placeName: string;
  registDt: string;
  address: string;
}

export interface MostVisitedPlace {
  mungpleId: number;
  photoUrl: string;
  placeName: string;
  visitCount: number;
}
