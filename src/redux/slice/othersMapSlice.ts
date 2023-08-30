import { createSlice } from '@reduxjs/toolkit';
import { idDefault } from '../../page/map/index.types';

const initialState = {
  zoom: 6,
  lat: 36,
  lng: 127.5,
  selectedIcon: 0,
  selectedArea: '가운데',
  link: 'https://www.delgo.pet',
  level: 13,
  isCopy: false,
  viewCount: 0,
  detailImgUrl: '',
  currentPlaceName: '',
  certToggle: false,
  selectedId: idDefault,
};

export const othersMapSlice = createSlice({
  name: 'othersMap',
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
    setLink(state, action) {
      state.link = action.payload;
    },
    clearLink(state) {
      state.link = 'https://map.delgo.pet';
    },
    setViewCount(state) {
      state.viewCount += 1;
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
      state.selectedId = idDefault;
    },
    setMapCustomPosition(state, action) {
      state.selectedId = {
        ...idDefault,
        lat: action.payload.lat,
        lng: action.payload.lng,
      };
    },
  },
});

export const othersMapAction = othersMapSlice.actions;

export default othersMapSlice.reducer;
