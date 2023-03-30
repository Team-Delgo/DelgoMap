import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  zoom: 0,
  lat: 0,
  lng: 0,
  selectedIcon: 0,
  selectedArea: '송파',
  link: 'https://www.delgo.pet',
  isCopy: false,
  viewCount: 0,
  detailImgUrl: '',
  currentPlaceName: '',
  certToggle: false,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
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
  },
});

export const mapAction = mapSlice.actions;

export default mapSlice.reducer;
