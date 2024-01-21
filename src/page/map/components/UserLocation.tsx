import React from 'react';
import UserLocationIcon from '../../../common/icons/user-location.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';

interface Props {
  move: (lat: number, lng: number) => void;
  setLocation: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}

function UserLocation({ move, setLocation }: Props) {
  const { OS } = useSelector((state: RootState) => state.persist.device);
  const moveToCurrentLocation = () => {
    if (OS === '') window.BRIDGE.checkGPSService();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
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
