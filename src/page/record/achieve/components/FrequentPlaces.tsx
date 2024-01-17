import React from 'react';
import { MostVisitedPlace } from 'common/types/mungPlace';

interface Props {
  places: Array<MostVisitedPlace>;
  petName: string
}

export const FrequentPlaces = ({ places,petName }: Props) => {
  return (
    <section className="frequent-places">
      <header>
        <h1>{petName}의 가장 많이 방문한 장소</h1>
      </header>
      {places?.length > 0 ? (
        <ul>
          {places?.map((place: MostVisitedPlace) => (
            <li className="frequent-places-row" key={place.mungpleId}>
              <img src={place.photoUrl} width={49} height={49} alt={`${place.placeName} 이미지`} />
              <div className="frequent-places-row-info">
                <span className="frequent-places-row-info-place-name">{place.placeName}</span>
                <span className="frequent-places-row-info-count">{place.visitCount}회 방문</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#646566', textAlign: 'center' }}>기록 된 장소가 없어요</p>
      )}
    </section>
  );
};
