import { createSlice } from '@reduxjs/toolkit';
import { SelectedMungple, defaultSelectedMungple } from '../../page/map/index.types';

interface MapSlice {
  zoom: number;
  lat: number;
  lng: number;
  detailImgUrl: string;
  currentPlaceName: string;
  certToggle: boolean;
  selectedId: SelectedMungple;
}

const initialState: MapSlice = {
  zoom: 6,
  lat: 37.5057018,
  lng: 127.1141119,
  detailImgUrl: '',
  currentPlaceName: '',
  certToggle: false,
  selectedId: defaultSelectedMungple,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectedIdAddress(state, action) {
      state.selectedId = {
        ...state.selectedId,
        address: action.payload,
      };
    },
    setCurrentPosition(state, action) {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.zoom = action.payload.zoom;
    },
    clearPosition(state) {
      state = initialState;
    },
    setDetailUrl(state, action) {
      state.detailImgUrl = action.payload;
    },
    setCurrentPlaceName(state, action) {
      state.currentPlaceName = action.payload;
    },
    setCertToggle(state, action) {
      state.certToggle = action.payload;
    },
    setSelectedId(state, action) {
      state.selectedId = action.payload;
    },
    clearSelectedId(state, action) {
      state.selectedId = defaultSelectedMungple;
    },
    setMapCustomPosition(state, action) {
      state.selectedId = {
        ...defaultSelectedMungple,
        lat: action.payload.lat,
        lng: action.payload.lng,
      };
    },
  },
});

export const mapAction = mapSlice.actions;

export default mapSlice.reducer;
