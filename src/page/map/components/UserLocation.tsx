import React from 'react';
import UserLocationIcon from '../../../common/icons/user-location.svg';

interface Props {
  move: (lat: number, lng: number) => void;
}

function UserLocation({ move }: Props) {
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        move(lat, lng);
      });
    }
  };

  return (
    <div aria-hidden onClick={moveToCurrentLocation} className="user-location">
      <img src={UserLocationIcon} alt="user-location" />
    </div>
  );
}

export default UserLocation;
